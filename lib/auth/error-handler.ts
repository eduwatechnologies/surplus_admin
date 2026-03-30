/**
 * Maps NextAuth error codes to user-friendly messages
 */
export function getAuthErrorMessage(error?: string | null): string {
  if (!error) return "An unknown authentication error occurred"

  switch (error) {
    case "Configuration":
      return "There is a problem with the server configuration."
    case "AccessDenied":
      return "You do not have permission to sign in."
    case "Verification":
      return "The verification link is no longer valid."
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
    case "EmailSignin":
    case "CredentialsSignin":
      return "There was a problem with your authentication. Please try again."
    default:
      return "An unknown authentication error occurred."
  }
}
