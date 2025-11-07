def test_profile_navigation():
    driver = webdriver.Chrome(service=service)
    driver.get("APP_URL")
    
    # Click profile button in footer (adjust selector based on Footer's rendered HTML)
    profile_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(@data-testid, 'profile-button')]"))
    )
    profile_button.click()
    
    # Verify URL changes
    WebDriverWait(driver, 10).until(EC.url_contains("/Profile"))
    assert "/Profile" in driver.current_url
    driver.quit()