def test_tab_navigation():
    driver = webdriver.Chrome(service=service)
    driver.get("APP_URL")
    
    # Click "Hotels" tab
    hotels_tab = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Hotels')]"))
    )
    hotels_tab.click()
    
    # Verify hotels load
    hotels = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "card"))  # From styles.card
    )
    assert len(hotels) > 0
    driver.quit()