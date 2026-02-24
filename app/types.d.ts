declare module '*.md' {
  const content: string
  export default content
}

declare module '*.json' {
  const value: {
    bookmarks: Array<{
      title: string
      url: string
      category: string
      description: string
      notes: string
    }>
    lastUpdated: string
  }
  export default value
}
