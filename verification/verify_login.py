
from playwright.sync_api import sync_playwright

def verify_login():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            # Visit the login page
            page.goto("http://localhost:5173/user-login")

            # Wait for the page to load
            page.wait_for_selector("h1:text('Welcome')")

            # Take a screenshot
            page.screenshot(path="verification/login_screen.png")
            print("Login screen verified.")
        except Exception as e:
            print(f"Error verifying login: {e}")
            page.screenshot(path="verification/login_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_login()
