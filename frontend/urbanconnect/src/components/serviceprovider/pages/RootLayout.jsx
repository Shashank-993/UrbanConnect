import { Inter } from "next/font/google"
import "../../../../src/index.css"
import { ThemeProvider } from "../components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Provider Dashboard",
  description: "Modern provider dashboard built with Next.js and Tailwind CSS",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
