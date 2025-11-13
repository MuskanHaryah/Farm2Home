"""
API Endpoint Testing Script for Address Management
Run this script to test all address API endpoints
Usage: python test_address_api.py
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:8000"
TEST_CUSTOMER_ID = 6  # Using Muskan's customer ID

# ANSI color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}TEST: {test_name}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")

def print_result(success, message):
    if success:
        print(f"{Colors.OKGREEN}✓ PASS:{Colors.ENDC} {message}")
    else:
        print(f"{Colors.FAIL}✗ FAIL:{Colors.ENDC} {message}")

def print_response(response):
    print(f"{Colors.OKCYAN}Response Status:{Colors.ENDC} {response.status_code}")
    try:
        data = response.json()
        print(f"{Colors.OKCYAN}Response Body:{Colors.ENDC}")
        print(json.dumps(data, indent=2))
    except:
        print(f"{Colors.WARNING}Could not parse JSON response{Colors.ENDC}")
        print(response.text[:500])

# Test 1: GET - Fetch all addresses (with addresses)
def test_get_addresses_success():
    print_test_header("GET /api/customer/addresses/ - Fetch Addresses (Success)")
    
    url = f"{BASE_URL}/api/customer/addresses/"
    params = {"customer_id": TEST_CUSTOMER_ID}
    
    try:
        response = requests.get(url, params=params)
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                print_result(True, f"Successfully fetched {data.get('count', 0)} addresses")
                return data.get('data', [])
            else:
                print_result(False, f"Status not 'success': {data.get('message')}")
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
    
    return []

# Test 2: GET - Fetch addresses with invalid customer_id
def test_get_addresses_invalid_customer():
    print_test_header("GET /api/customer/addresses/ - Invalid Customer ID")
    
    url = f"{BASE_URL}/api/customer/addresses/"
    params = {"customer_id": 99999}  # Non-existent customer
    
    try:
        response = requests.get(url, params=params)
        print_response(response)
        
        # Should return empty list or error
        if response.status_code == 200:
            data = response.json()
            if data.get('count', 0) == 0:
                print_result(True, "Correctly returned empty list for invalid customer")
            else:
                print_result(False, f"Expected empty list, got {data.get('count')} addresses")
        else:
            print_result(True, f"Correctly returned error status {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 3: POST - Add new address (valid data)
def test_add_address_success():
    print_test_header("POST /api/customer/addresses/add/ - Add Address (Valid Data)")
    
    url = f"{BASE_URL}/api/customer/addresses/add/"
    payload = {
        "customer_id": TEST_CUSTOMER_ID,
        "label": "HOME",
        "address_line": "123 Test Street, Apartment 4B",
        "city": "Lahore",
        "postal_code": "54000",
        "phone": "03001234567",
        "is_default": False
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 201:
            data = response.json()
            if data.get('status') == 'success':
                print_result(True, f"Successfully added address with ID: {data.get('data', {}).get('address_id')}")
                return data.get('data')
            else:
                print_result(False, f"Status not 'success': {data.get('message')}")
        else:
            print_result(False, f"Expected 201, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
    
    return None

# Test 4: POST - Add address with invalid phone
def test_add_address_invalid_phone():
    print_test_header("POST /api/customer/addresses/add/ - Invalid Phone Number")
    
    url = f"{BASE_URL}/api/customer/addresses/add/"
    payload = {
        "customer_id": TEST_CUSTOMER_ID,
        "label": "WORK",
        "address_line": "456 Office Plaza",
        "city": "Karachi",
        "postal_code": "75000",
        "phone": "123",  # Invalid - too short
        "is_default": False
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 400:
            print_result(True, "Correctly rejected invalid phone number")
        else:
            print_result(False, f"Expected 400, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 5: POST - Add address with invalid postal code
def test_add_address_invalid_postal():
    print_test_header("POST /api/customer/addresses/add/ - Invalid Postal Code")
    
    url = f"{BASE_URL}/api/customer/addresses/add/"
    payload = {
        "customer_id": TEST_CUSTOMER_ID,
        "label": "OTHER",
        "address_line": "789 Random Road",
        "city": "Islamabad",
        "postal_code": "123",  # Invalid - not 5 digits
        "phone": "03009876543",
        "is_default": False
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 400:
            print_result(True, "Correctly rejected invalid postal code")
        else:
            print_result(False, f"Expected 400, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 6: POST - Add address with missing required fields
def test_add_address_missing_fields():
    print_test_header("POST /api/customer/addresses/add/ - Missing Required Fields")
    
    url = f"{BASE_URL}/api/customer/addresses/add/"
    payload = {
        "customer_id": TEST_CUSTOMER_ID,
        "label": "HOME"
        # Missing: address_line, city, postal_code, phone
    }
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 400:
            print_result(True, "Correctly rejected missing required fields")
        else:
            print_result(False, f"Expected 400, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 7: PUT - Update address (owned address)
def test_update_address_success(address_id):
    print_test_header(f"PUT /api/customer/addresses/{address_id}/ - Update Address (Owned)")
    
    if not address_id:
        print_result(False, "No address_id provided for testing")
        return
    
    url = f"{BASE_URL}/api/customer/addresses/{address_id}/"
    payload = {
        "customer_id": TEST_CUSTOMER_ID,
        "label": "WORK",
        "address_line": "Updated Address Line 999",
        "city": "Faisalabad",
        "postal_code": "38000",
        "phone": "03111111111",
        "is_default": False
    }
    
    try:
        response = requests.put(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                print_result(True, "Successfully updated address")
            else:
                print_result(False, f"Status not 'success': {data.get('message')}")
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 8: PUT - Update address with wrong customer (ownership check)
def test_update_address_not_owned(address_id):
    print_test_header(f"PUT /api/customer/addresses/{address_id}/ - Update Address (Not Owned)")
    
    if not address_id:
        print_result(False, "No address_id provided for testing")
        return
    
    url = f"{BASE_URL}/api/customer/addresses/{address_id}/"
    payload = {
        "customer_id": 99999,  # Different customer
        "label": "HOME",
        "address_line": "Hacker Address",
        "city": "Hacker City",
        "postal_code": "00000",
        "phone": "03000000000",
        "is_default": False
    }
    
    try:
        response = requests.put(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 403:
            print_result(True, "Correctly prevented update of non-owned address")
        elif response.status_code == 404:
            print_result(True, "Correctly returned 404 for non-owned address")
        else:
            print_result(False, f"Expected 403 or 404, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 9: POST - Set address as default
def test_set_default_address(address_id):
    print_test_header(f"POST /api/customer/addresses/{address_id}/set-default/ - Set Default")
    
    if not address_id:
        print_result(False, "No address_id provided for testing")
        return
    
    url = f"{BASE_URL}/api/customer/addresses/{address_id}/set-default/"
    payload = {"customer_id": TEST_CUSTOMER_ID}
    
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                print_result(True, "Successfully set address as default")
            else:
                print_result(False, f"Status not 'success': {data.get('message')}")
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 10: DELETE - Delete address (non-default)
def test_delete_address_success(address_id):
    print_test_header(f"DELETE /api/customer/addresses/{address_id}/ - Delete Address")
    
    if not address_id:
        print_result(False, "No address_id provided for testing")
        return
    
    url = f"{BASE_URL}/api/customer/addresses/{address_id}/"
    payload = {"customer_id": TEST_CUSTOMER_ID}
    
    try:
        response = requests.delete(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                print_result(True, "Successfully deleted address")
            else:
                print_result(False, f"Status not 'success': {data.get('message')}")
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Test 11: DELETE - Delete with wrong customer (ownership check)
def test_delete_address_not_owned(address_id):
    print_test_header(f"DELETE /api/customer/addresses/{address_id}/ - Delete Address (Not Owned)")
    
    if not address_id:
        print_result(False, "No address_id provided for testing")
        return
    
    url = f"{BASE_URL}/api/customer/addresses/{address_id}/"
    payload = {"customer_id": 99999}  # Different customer
    
    try:
        response = requests.delete(url, json=payload, headers={"Content-Type": "application/json"})
        print_response(response)
        
        if response.status_code == 403:
            print_result(True, "Correctly prevented deletion of non-owned address")
        elif response.status_code == 404:
            print_result(True, "Correctly returned 404 for non-owned address")
        else:
            print_result(False, f"Expected 403 or 404, got {response.status_code}")
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")

# Main test runner
def run_all_tests():
    print(f"{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║        ADDRESS API ENDPOINT TESTING SUITE                 ║")
    print("║        Testing Address Management System                  ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}")
    
    print(f"\n{Colors.OKBLUE}Configuration:{Colors.ENDC}")
    print(f"  Base URL: {BASE_URL}")
    print(f"  Test Customer ID: {TEST_CUSTOMER_ID}")
    print(f"  Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests in sequence
    addresses = test_get_addresses_success()
    test_get_addresses_invalid_customer()
    
    new_address = test_add_address_success()
    test_add_address_invalid_phone()
    test_add_address_invalid_postal()
    test_add_address_missing_fields()
    
    # Use newly created address or existing one for update/delete tests
    test_address_id = None
    if new_address and 'address_id' in new_address:
        test_address_id = new_address['address_id']
    elif addresses and len(addresses) > 0:
        test_address_id = addresses[0].get('address_id')
    
    if test_address_id:
        test_update_address_success(test_address_id)
        test_update_address_not_owned(test_address_id)
        test_set_default_address(test_address_id)
        test_delete_address_not_owned(test_address_id)
        
        # Create another address for deletion test
        another_address = test_add_address_success()
        if another_address and 'address_id' in another_address:
            test_delete_address_success(another_address['address_id'])
    else:
        print(f"\n{Colors.WARNING}Warning: No address ID available for update/delete tests{Colors.ENDC}")
        print(f"{Colors.WARNING}Please create a customer and address manually, then update TEST_CUSTOMER_ID{Colors.ENDC}")
    
    # Summary
    print(f"\n{Colors.BOLD}{Colors.HEADER}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║                   TEST SUITE COMPLETE                      ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.ENDC}")
    print(f"\n{Colors.OKGREEN}All tests completed!{Colors.ENDC}")
    print(f"{Colors.OKCYAN}Review the results above to verify API functionality.{Colors.ENDC}\n")

if __name__ == "__main__":
    run_all_tests()
