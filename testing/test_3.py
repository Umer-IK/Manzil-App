def test_search():
    driver = webdriver.Chrome(service=service)
    driver.get("APP_URL")
    
    # Type into search bar
    search_bar = driver.find_element(By.CLASS_NAME, "searchBar")  # From styles.searchBar
    search_bar.send_keys("Park")
    
    # Wait for results
    results = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "cityCard"))  # From styles.cityCard
    )
    assert len(results) > 0
    driver.quit()