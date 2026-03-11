"""
Selenium UI Tests for API Test Generator
"""
import pytest

# Skip Selenium tests in CI environment (no browser available)
pytest.skip("Skipping Selenium tests in CI environment", allow_module_level=True)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@pytest.fixture
def driver():
    """Setup Chrome WebDriver"""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)
    yield driver
    driver.quit()


class TestUIFunctionality:
    """Test UI functionality using Selenium"""
    
    BASE_URL = "http://localhost:8080/ui"
    
    def test_page_loads(self, driver):
        """Test that the UI page loads successfully"""
        driver.get(self.BASE_URL)
        assert "API Test Generator" in driver.title
    
    def test_upload_area_visible(self, driver):
        """Test that upload area is visible"""
        driver.get(self.BASE_URL)
        upload_area = driver.find_element(By.ID, "uploadArea")
        assert upload_area.is_displayed()
    
    def test_generate_button_disabled_initially(self, driver):
        """Test that generate button is disabled without file"""
        driver.get(self.BASE_URL)
        generate_btn = driver.find_element(By.ID, "generateBtn")
        assert not generate_btn.is_enabled()
    
    # Add more UI tests as needed
