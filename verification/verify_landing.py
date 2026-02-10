from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the landing page
    page.goto("http://localhost:5173")

    # Wait for the main content to load
    page.wait_for_selector('text="I am"')

    # Take a screenshot
    page.screenshot(path="verification/landing_page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
