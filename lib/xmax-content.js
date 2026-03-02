// xMax Content Generator - Platform specific
const products = require('@/data/xmax-content.json')

// Platform configurations
const PLATFORMS = {
  x: {
    maxLength: 280,
    style: 'short punchy engaging',
    cta: 'Follow for more',
    hashtags: true,
    emojis: true
  },
  reddit: {
    maxLength: 3000,
    style: 'long-form value-add',
    cta: 'Discuss below',
    hashtags: false,
    emojis: false
  }
}

// Generate content for a platform
function generateContent(platform = 'x') {
  const config = PLATFORMS[platform]
  const product = products.products[Math.floor(Math.random() * products.products.length)]
  const theme = products.contentThemes[Math.floor(Math.random() * products.contentThemes.length)]
  
  const tagline = product.tagline[platform]
  
  if (platform === 'x') {
    return {
      platform: 'x',
      content: `${tagline} #${product.hashtags.join(' #')}`,
      product: product.name,
      theme: theme.name,
      length: tagline.length + product.hashtags.join(' #').length
    }
  } else {
    return {
      platform: 'reddit',
      content: `${product.description}\n\n${tagline}\n\nDiscussion: What tools are you using for ${theme.redditAngle.toLowerCase()}?`,
      product: product.name,
      theme: theme.name,
      length: tagline.length
    }
  }
}

// Get both X and Reddit content
function getAllContent() {
  return {
    x: generateContent('x'),
    reddit: generateContent('reddit'),
    generatedAt: new Date().toISOString()
  }
}

module.exports = { generateContent, getAllContent, PLATFORMS }
