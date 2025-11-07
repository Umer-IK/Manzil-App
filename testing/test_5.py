def test_initial_content_load():
    driver = webdriver.Chrome(service=service)
    driver.get("APP_URL")
    
    # Check default city (e.g., Islamabad) and temperature
    city_name = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "cityName"))
    )
    assert city_name.text == "Islamabad"
    
    # Check temperature is displayed
    temperature = driver.find_element(By.CLASS_NAME, "temperatureText")  # From styles.temperature
    assert "°C" in temperature.text
    driver.quit()