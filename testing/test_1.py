def test_city_selection():
    driver = webdriver.Chrome(service=service)
    driver.get("APP_URL")
    
    # Open city dropdown and select "Lahore"
    city_dropdown = driver.find_element(By.CLASS_NAME, "pickerSelect")  # Adjust class based on RNPickerSelect's rendered HTML
    city_dropdown.click()
    lahore_option = driver.find_element(By.XPATH, "//div[contains(text(), 'Lahore')]")
    lahore_option.click()
    
    # Verify city name updates
    city_name = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "cityName"))  # From styles.cityName
    )
    assert city_name.text == "Lahore"
    
    # Verify tourist spots load
    tourist_spots = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "placeCard2"))  # From styles.placeCard2
    )
    assert len(tourist_spots) > 0
    driver.quit()