#!/usr/bin/env python3
"""
Reddit Digestion System
Tracks Reddit posts, learns preferences, generates daily digests at 5pm IST
"""

import json
import http.client
import time
from datetime import datetime, timedelta
from urllib.parse import urlencode
import os
import requests

class RedditTracker:
    def __init__(self):
        self.db_file = '/home/clawdonaws/.openclaw/workspace/.reddit-db.json'
        self.subreddits = [
            'clawdbot',
            'ClaudeAI',
            'ClaudeCode',
            'Futurology',
            'AgentsOfAI',
            'ArtificialInteligence',
            'artificial',
            'OpenAI'
        ]
        self.comments_file = '/home/clawdonaws/.openclaw/workspace/.reddit-comments.json'
        self.load_db()

    def load_db(self):
        """Load Reddit database from file"""
        if os.path.exists(self.db_file):
            with open(self.db_file, 'r') as f:
                self.db = json.load(f)
        else:
            self.db = {
                'posts': {},
                'preferences': {
                    'preferred_types': ['text', 'image'],
                    'excluded_types': ['meme', 'low-effort'],
                    'preferred_topics': ['AI', 'tools', 'future'],
                    'digest_length': 3
                },
                'digest_history': [],
                'engagement_data': {}
            }
            self.save_db()

    def save_db(self):
        """Save Reddit database to file"""
        with open(self.db_file, 'w') as f:
            json.dump(self.db, f, indent=2)

    def get_top_posts(self, subreddit, limit=25):
        """
        Fetch top posts from a subreddit
        Returns list of post objects with metadata
        """
        posts = []
        try:
            conn = http.client.HTTPSConnection("www.reddit.com")
            params = {
                'limit': limit,
                'sort': 'top',
                't': 'day'
            }
            conn.request("GET", f"/r/{subreddit}/?{urlencode(params)}")
            response = conn.getresponse()
            data = response.read().decode('utf-8')

            # Parse HTML to extract post data
            # This is a simplified parser - in production would use BeautifulSoup
            import re
            post_pattern = r'"id":"([^"]+)".*?"title":"([^"]+)".*?"score":(\d+).*?"num_comments":(\d+)'

            for match in re.finditer(post_pattern, data):
                post_id = match.group(1)
                if post_id in self.db['posts']:
                    continue  # Already stored

                posts.append({
                    'id': post_id,
                    'subreddit': subreddit,
                    'title': match.group(2),
                    'score': int(match.group(3)),
                    'comments': int(match.group(4)),
                    'type': self.detect_post_type(data, post_id),
                    'engagement_score': int(match.group(3)) + int(match.group(4)) * 0.1,
                    'timestamp': datetime.utcnow().isoformat()
                })

            conn.close()
        except Exception as e:
            print(f"Error fetching {subreddit}: {e}")

        return posts

    def detect_post_type(self, html, post_id):
        """Detect post type based on HTML content"""
        # This is a simplified detection - in production would be more robust
        if f'"media":null' in html or 'self' in html:
            return 'text'
        elif 'preview' in html:
            return 'image'
        elif 'type":"video"' in html:
            return 'video'
        elif 'type":"link"' in html:
            return 'link'
        else:
            return 'text'

    def fetch_all_subreddits(self):
        """Fetch top posts from all subreddits"""
        all_posts = []

        for subreddit in self.subreddits:
            print(f"Fetching {subreddit}...")
            posts = self.get_top_posts(subreddit, limit=25)
            all_posts.extend(posts)

        # Deduplicate by ID
        unique_posts = {}
        for post in all_posts:
            unique_posts[post['id']] = post

        return list(unique_posts.values())

    def store_posts(self, posts):
        """Store fetched posts in database"""
        stored_count = 0

        for post in posts:
            if post['id'] not in self.db['posts']:
                self.db['posts'][post['id']] = post
                stored_count += 1

        self.save_db()
        return stored_count

    def calculate_engagement(self, post_id):
        """Calculate engagement score based on clicks, upvotes, comments"""
        post = self.db['posts'].get(post_id, {})
        score = post.get('engagement_score', 0)

        # Adjust based on clicks (in production would track clicks)
        # score *= (1 + clicks * 0.1)

        return score

    def rank_posts(self):
        """Rank all stored posts by engagement score"""
        posts = list(self.db['posts'].values())

        # Filter based on preferences
        preferred_types = self.db['preferences']['preferred_types']
        excluded_types = self.db['preferences']['excluded_types']

        filtered_posts = []
        for post in posts:
            # Exclude unwanted types
            if post['type'] in excluded_types:
                continue

            # Include preferred types (or all if none preferred yet)
            if post['type'] in preferred_types or not preferred_types:
                filtered_posts.append(post)

        # Sort by engagement score
        sorted_posts = sorted(
            filtered_posts,
            key=lambda p: p['engagement_score'],
            reverse=True
        )

        return sorted_posts

    def generate_digest(self, posts):
        """Generate daily digest with formatted posts"""
        digest = {
            'date': datetime.utcnow().strftime('%Y-%m-%d'),
            'digest_id': f"daily-{datetime.utcnow().strftime('%Y%m%d')}",
            'posts': [],
            'total_posts': len(posts),
            'total_engagement': sum(p['engagement_score'] for p in posts)
        }

        # Include top posts based on digest length preference
        max_posts = self.db['preferences'].get('digest_length', 3)

        for post in posts[:max_posts]:
            digest['posts'].append({
                'id': post['id'],
                'subreddit': post['subreddit'],
                'title': post['title'],
                'score': post['score'],
                'comments': post['comments'],
                'type': post['type'],
                'engagement_score': post['engagement_score']
            })

        return digest

    def send_digest(self, digest):
        """Send digest via Telegram (to be implemented)"""
        # Format message
        message = f"📊 Reddit Digest - {digest['date']}\n\n"

        for i, post in enumerate(digest['posts'], 1):
            message += f"{i}. **{post['subreddit']}** - {post['title']}\n"
            message += f"   🔥 Score: {post['score']} | 💬 Comments: {post['comments']}\n"
            message += f"   Type: {post['type']}\n\n"

        message += "Did you find this useful? Please respond with 👍 or 👎"

        # Send via Telegram (implement in production)
        # message.send(channel='telegram', text=message)

        return message

    def record_engagement(self, post_id, engagement_type):
        """Record user engagement with a post"""
        if post_id not in self.db['engagement_data']:
            self.db['engagement_data'][post_id] = []

        self.db['engagement_data'][post_id].append({
            'type': engagement_type,
            'timestamp': datetime.utcnow().isoformat()
        })

        self.save_db()

    def ask_feedback(self, digest_id):
        """Ask user for feedback on digest"""
        # Send message to user
        message = f"📊 Reddit Digest sent!\n\n{digest_id}\n\nDid you find this useful?"

        # In production, send via Telegram
        # message.send(channel='telegram', text=message)

        return message

    def update_preferences(self, feedback):
        """Update preferences based on user feedback"""
        if feedback.lower() in ['👍', 'yes', 'y']:
            # Positive feedback - keep current preferences
            pass
        elif feedback.lower() in ['👎', 'no', 'n']:
            # Negative feedback - adjust
            # For now, just log it
            pass

        self.save_db()

# Main execution
if __name__ == '__main__':
    tracker = RedditTracker()

    # Fetch all posts
    all_posts = tracker.fetch_all_subreddits()
    print(f"Fetched {len(all_posts)} new posts")

    # Store posts
    stored = tracker.store_posts(all_posts)
    print(f"Stored {stored} new posts")

    # Rank posts
    ranked_posts = tracker.rank_posts()
    print(f"Ranked {len(ranked_posts)} posts")

    # Generate digest
    digest = tracker.generate_digest(ranked_posts)
    print(f"Generated digest with {len(digest['posts'])} posts")

    # Send digest
    message = tracker.send_digest(digest)
    print(f"Digest message:\n{message}")

    # Ask feedback
    feedback_msg = tracker.ask_feedback(digest['digest_id'])
    print(f"Feedback message:\n{feedback_msg}")
