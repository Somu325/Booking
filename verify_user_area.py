from playwright.sync_api import sync_playwright
import base64
import json
import time

def base64url_encode(data):
    return base64.urlsafe_b64encode(json.dumps(data).encode('utf-8')).decode('utf-8').rstrip('=')

def verify_user_area():
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {"role": "user", "exp": 9999999999}
    token = f"{base64url_encode(header)}.{base64url_encode(payload)}.signature"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()

        # Set cookies
        context.add_cookies([
            {"name": "Usertoken", "value": token, "domain": "localhost", "path": "/"}
        ])

        # 1. Verify Booking History
        url_history = "http://localhost:5173/booking-history"
        print(f"Navigating to {url_history}...")
        try:
            page.goto(url_history)
            page.wait_for_load_state("networkidle")

            if page.get_by_text("Booking History").first.is_visible():
                print("SUCCESS: Booking History title found")
            else:
                print("FAILURE: Booking History title not found")

            page.screenshot(path="/home/jules/verification/booking_history_redesign.png")
            print("Screenshot saved to booking_history_redesign.png")
        except Exception as e:
            print(f"ERROR History: {e}")

        # 2. Verify Profile
        url_profile = "http://localhost:5173/userprofile"
        print(f"Navigating to {url_profile}...")
        try:
            page.goto(url_profile)
            page.wait_for_load_state("networkidle")

            # Check for Personal Information section
            if page.get_by_text("Personal Information").first.is_visible():
                print("SUCCESS: Profile Personal Info found")
            else:
                print("FAILURE: Profile Personal Info not found")

            page.screenshot(path="/home/jules/verification/profile_redesign.png")
            print("Screenshot saved to profile_redesign.png")
        except Exception as e:
            print(f"ERROR Profile: {e}")

        # 3. Verify Slot Booking
        # Use a dummy coach ID
        today = time.strftime("%Y-%m-%d")
        url_slot = f"http://localhost:5173/selectslot/1?date={today}"
        print(f"Navigating to {url_slot}...")
        try:
            page.goto(url_slot)
            page.wait_for_load_state("networkidle")

            if page.get_by_text("Select a Slot").first.is_visible():
                print("SUCCESS: Slot Booking title found")
            else:
                print("FAILURE: Slot Booking title not found")

            page.screenshot(path="/home/jules/verification/slot_booking_redesign.png")
            print("Screenshot saved to slot_booking_redesign.png")
        except Exception as e:
            print(f"ERROR Slot: {e}")

        browser.close()

if __name__ == "__main__":
    verify_user_area()
