#!/usr/bin/env python3
"""
Reddit Digestion System - Uses PRAW (official Reddit API)
"""

import praw
import prawcore
import json
import os
from datetime import datetime

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
        self.load_db()

        # Initialize Reddit API client
        try:
            self.reddit = praw.Reddit(
                client_id='YOUR_CLIENT_ID',
                client_secret='YOUR_CLIENT_SECRET',
                user_agent='RedditDigestBot/1.0 by Robin'
            )
            print("✅ Connected to Reddit API")
        except Exception as e:
            print(f"❌ Failed to connect to Reddit API: {e}")
            print("\nSetup instructions:")
            print("1. Go to https://www.reddit.com/prefs/apps")
            print("2. Create a new app (script type)")
            print("3. Copy client_id and client_secret")
            print("4. Update the config section in this script")
            self.reddit = None

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

    def get_top_posts(self, subreddit):
        """Fetch top posts from a subreddit using PRAW"""
        posts = []

        if not self.reddit:
            return posts

        try:
            # Get subreddit
            sub = self.reddit.subreddit(subreddit)
            # Get top posts from today
            top_posts = list(sub.top('day', limit=100))

            for post in top_posts:
                # Skip stickied posts and NSFW
                if post.stickied or post.over_18:
                    continue

                post_id = post.id
                if post_id not in self.db['posts']:
                    posts.append({
                        'id': post_id,
                        'subreddit': subreddit,
                        'title': post.title,
                        'score': post.score,
                        'comments': post.num_comments,
                        'type': self.detect_post_type(post),
                        'engagement_score': post.score + post.num_comments * 0.1,
                        'timestamp': datetime.now().isoformat()
                    })

            print(f"  Fetched {len(posts)} new posts from {subreddit}")

        except prawcore.exceptions.Forbidden:
            print(f"  ⚠️  No access to r/{subreddit} - check API permissions")
        except Exception as e:
            print(f"  ❌ Error fetching {subreddit}: {e}")

        return posts

    def detect_post_type(self, post):
        """Detect post type"""
        if post.url.startswith(('https://i.redd.it/', 'https://i.imgur.com/')):
            return 'image'
        elif post.url.endswith(('.jpg', '.png', '.gif', '.webp')):
            return 'image'
        elif post.url.endswith(('.mp4', '.webm')):
            return 'video'
        elif post.url.startswith('https://v.redd.it/'):
            return 'video'
        elif post.is_self:
            return 'text'
        else:
            return 'link'

    def fetch_all_subreddits(self):
        """Fetch top posts from all subreddits"""
        all_posts = []

        for subreddit in self.subreddits:
            print(f"Fetching {subreddit}...")
            posts = self.get_top_posts(subreddit)
            all_posts.extend(posts)

        # Deduplicate
        unique_posts = {}
        for post in all_posts:
            unique_posts[post['id']] = post

        return list(unique_posts.values())

    def store_posts(self, posts):
        """Store posts in database"""
        stored_count = 0
        for post in posts:
            if post['id'] not in self.db['posts']:
                self.db['posts'][post['id']] = post
                stored_count += 1
        self.save_db()
        return stored_count

    def rank_posts(self):
        """Rank posts by engagement"""
        posts = list(self.db['posts'].values())
        preferred_types = self.db['preferences']['preferred_types']
        excluded_types = self.db['preferences']['excluded_types']

        filtered_posts = []
        for post in posts:
            if post['type'] in excluded_types:
                continue
            if post['type'] in preferred_types or not preferred_types:
                filtered_posts.append(post)

        sorted_posts = sorted(filtered_posts, key=lambda p: p['engagement_score'], reverse=True)
        return sorted_posts

    def generate_digest(self, posts):
        """Generate daily digest"""
        digest = {
            'date': datetime.now().strftime('%Y-%m-%d'),
            'digest_id': f"daily-{datetime.now().strftime('%Y%m%d')}",
            'posts': [],
            'total_posts': len(posts)
        }

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
        """Format and send digest"""
        message = f"📊 Reddit Digest - {digest['date']}\n\n"

        for i, post in enumerate(digest['posts'], 1):
            message += f"{i}. **{post['subreddit']}** - {post['title']}\n"
            message += f"   🔥 Score: {post['score']} | 💬 Comments: {post['comments']}\n"
            message += f"   Type: {post['type']}\n\n"

        message += "Did you find this useful? Please respond with 👍 or 👎"
        return message

    def ask_feedback(self, digest_id):
        """Ask user for feedback"""
        return f"📊 Reddit Digest sent!\n\n{digest_id}\n\nDid you find this useful?"

def main():
    tracker = RedditTracker()

    if not tracker.reddit:
        print("❌ Reddit API not configured")
        return

    all_posts = tracker.fetch_all_subreddits()
    print(f"\n✅ Fetched {len(all_posts)} total posts")

    stored = tracker.store_posts(all_posts)
    print(f"✅ Stored {stored} new posts")

    ranked_posts = tracker.rank_posts()
    print(f"✅ Ranked {len(ranked_posts)} posts")

    digest = tracker.generate_digest(ranked_posts)
    print(f"✅ Generated digest with {len(digest['posts'])} posts")

    message = tracker.send_digest(digest)
    print(f"\n📊 Digest message:\n{message}")

    feedback_msg = tracker.ask_feedback(digest['digest_id'])
    print(f"\n💬 Feedback message:\n{feedback_msg}")

    return message, feedback_msg

if __name__ == '__main__':
    main()
