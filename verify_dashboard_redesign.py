from playwright.sync_api import sync_playwright
import base64
import json

def base64url_encode(data):
    return base64.urlsafe_b64encode(json.dumps(data).encode('utf-8')).decode('utf-8').rstrip('=')

def verify_dashboard():
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"role": "user", "exp": 9999999999}
    token = f"{base64url_encode(header)}.{base64url_encode(payload)}.signature"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Set viewport to large desktop to ensure Sidebar is visible
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080}
        )
        page = context.new_page()

        # Set cookies before navigation
        # We need to set the domain correctly. localhost is fine.
        context.add_cookies([
            {
                "name": "Usertoken",
                "value": token,
                "domain": "localhost",
                "path": "/"
            }
        ])

        url = "http://localhost:5173/screen"
        print(f"Navigating to {url} with token...")

        try:
            page.goto(url)
            page.wait_for_load_state("networkidle")

            # Check for Sidebar elements
            # Look for specific text in the sidebar navigation
            if page.get_by_role("button", name="Find a Coach").is_visible():
                print("SUCCESS: Sidebar 'Find a Coach' link found")
            else:
                print("FAILURE: Sidebar link not found")

            # Check for Header elements specific to Screen.tsx
            # "Welcome back, Guest" or similar
            if page.get_by_text("Welcome back").is_visible():
                print("SUCCESS: Header 'Welcome back' found")
            else:
                 print("FAILURE: Header not found")

            # Check for Main Content Area background
            # We can check computed style of the main container?
            # Or just rely on visual inspection via screenshot.

            page.screenshot(path="/home/jules/verification/dashboard_redesign.png")
            print("Screenshot saved to /home/jules/verification/dashboard_redesign.png")

        except Exception as e:
            print(f"ERROR: {e}")
            page.screenshot(path="/home/jules/verification/dashboard_error.png")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
