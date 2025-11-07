# test_home.py
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_home_page():
    # Setup
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    
    # Point to your React app's URL (must be running!)
    driver.get("http://34.226.13.20:3000")  # Replace with your app's URL
    
    # Test logic (example: check city selector exists)
    city_dropdown = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="city-picker"]'))
    )
    assert city_dropdown.is_displayed()
    
    # Cleanup
    driver.quit()