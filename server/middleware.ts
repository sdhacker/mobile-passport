import type { NextFetchEvent, NextRequest } from 'next/server'
import {NextResponse} from 'Next/server'
export function middleware(req: NextRequest, event: NextFetchEvent) {
  console.log('middleware')

  const pathName = req.nextUrl.pathname
  console.log('pathName:', pathName)

  // Perform Basic Auth on these paths:
  //   /api/pushNotification
  //   /api/pushUpdate
  if (pathName.startsWith('/api/push')) {
    const authorizationHeader = req.headers.get('authorization')
    console.log('authorizationHeader:', authorizationHeader)

    let wrongCredentials: boolean = false
    if (authorizationHeader) {
      // Get header value from "Basic <value>"
      const headerValueBase64 = authorizationHeader.split(' ')[1]

      // Decode from Base64
      const headerValue = Buffer.from(headerValueBase64, 'base64').toString()

      // Extract values from "<username>:<password>"
      const [username, password] = headerValue.split(':')

      // Get environment variables
      const basicAuthUsername = String(process.env.BASIC_AUTH_USERNAME)
      const basicAuthPassword = String(process.env.BASIC_AUTH_PASSWORD)

      // Compare credentials
      if (username !== basicAuthUsername || password !== basicAuthPassword) {
        wrongCredentials = true
      }
    }
    console.log('wrongCredentials:', wrongCredentials)

    if (!authorizationHeader || wrongCredentials) {
      // Perform Basic Auth
        req.nextUrl.pathname = `/api/401-Unauthorized`;
        return NextResponse.rewrite(req.nextUrl);
    }
  }
}
