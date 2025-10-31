addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  const cleanHeaders = new Headers(request.headers)
  const headersToRemove = [
    'content-security-policy',
    'content-security-policy-report-only',
    'require-trusted-types-for',
    'report-to',
    'x-client-data', // Google tracking header
    'cf-ray', // Cloudflare specific header
    'cf-connecting-ip' // Remove client IP from upstream requests
  ]
  
  headersToRemove.forEach(header => cleanHeaders.delete(header))

  // Process CSS requests
  if (url.pathname.startsWith('/css2')) {
    const googleUrl = url.href.replace(url.hostname, 'fonts.googleapis.com')
    
    try {
      const response = await fetch(googleUrl, { 
        headers: cleanHeaders,
        cf: {
          // Cache for 1 hour at edge
          cacheTtl: 3600,
          cacheEverything: true
        }
      })
      
      if (!response.ok) {
        console.error(`Google Fonts API error: ${response.status} ${response.statusText}`)
        return new Response('Font CSS temporarily unavailable', { 
          status: response.status >= 500 ? 502 : response.status,
          headers: { 'content-type': 'text/plain' }
        })
      }
      
      if (response.headers.get('content-type')?.includes('text/css')) {
        let css = await response.text()
        css = css.replace(/fonts\.gstatic\.com/g, `${url.hostname}/gstatic`)
                .replace(/fonts\.googleapis\.com/g, url.hostname)
        
        const responseHeaders = new Headers(response.headers)
        headersToRemove.forEach(header => responseHeaders.delete(header))
        
        responseHeaders.set('access-control-allow-origin', '*')
        responseHeaders.set('x-robots-tag', 'noindex')
        responseHeaders.set('cache-control', 'public, max-age=86400') // 24 hours
        
        return new Response(css, {
          headers: responseHeaders,
          status: response.status
        })
      }
      return response
    } catch (error) {
      console.error('Font CSS fetch error:', error.message)
      return new Response('Font CSS unavailable', { 
        status: 502,
        headers: { 'content-type': 'text/plain' }
      })
    }
  }
  
  // Process font file requests
  if (url.pathname.startsWith('/gstatic')) {
    const fontUrl = `https://fonts.gstatic.com${url.pathname.replace('/gstatic', '')}${url.search}`
    
    try {
      const response = await fetch(fontUrl, { 
        headers: cleanHeaders,
        cf: {
          // Cache font files for 7 days at edge
          cacheTtl: 604800,
          cacheEverything: true
        }
      })
      
      if (!response.ok) {
        console.error(`Google Fonts static error: ${response.status} ${response.statusText}`)
        return new Response('Font file temporarily unavailable', { 
          status: response.status >= 500 ? 502 : response.status,
          headers: { 'content-type': 'text/plain' }
        })
      }
      
      const responseHeaders = new Headers(response.headers)
      headersToRemove.forEach(header => responseHeaders.delete(header))
      
      responseHeaders.set('access-control-allow-origin', '*')
      responseHeaders.set('cache-control', 'public, max-age=31536000, immutable')
      
      return new Response(response.body, {
        headers: responseHeaders,
        status: response.status
      })
    } catch (error) {
      console.error('Font file fetch error:', error.message)
      return new Response('Font file unavailable', { 
        status: 502,
        headers: { 'content-type': 'text/plain' }
      })
    }
  }
  
  // Add a simple health check endpoint
  if (url.pathname === '/health' || url.pathname === '/') {
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'Google Fonts Proxy',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  }
  
  return new Response('Not Found', { 
    status: 404,
    headers: { 'content-type': 'text/plain' }
  })
}