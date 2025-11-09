import requests
from bs4 import BeautifulSoup
from bs4.element import Tag # CRITICAL: Import Tag for safety check

def scrape_wikipedia(url: str):
    """
    Fetches a Wikipedia article, extracts the title and clean text content,
    and returns a limited-length string of the content.
    """
    
    # 1. URL Validation
    if not url.startswith("https://en.wikipedia.org/wiki/"):
        # The scrape_wikipedia function should return (title, content)
        # We use (None, error_message) to signal a fatal error to main.py
        return None, "Error: Please provide a valid English Wikipedia URL."

    # 2. Network Request
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status() 
    except requests.exceptions.RequestException as e:
        return None, f"Error: Could not fetch the Wikipedia article. Details: {e}"

    # 3. HTML Parsing and Content Extraction
    soup = BeautifulSoup(response.content, 'html.parser')
    
    title_tag = soup.find('h1', id='firstHeading')
    title = title_tag.text if title_tag else "Untitled Article"

    # Find the main content div. Use fallback if the main ID isn't found.
    content_div = soup.find('div', id='mw-content-text')
    
    if not content_div:
        # Fallback for pages where mw-content-text might be missing/changed
        content_div = soup.find('div', class_='mw-parser-output')

    if not content_div:
        return title, "Error: Could not find main article content in the HTML structure."

    # Remove references (superscripts like [1], [a])
    for sup in content_div.find_all('sup', class_='reference'):
        sup.decompose()
    
    # 4. CRITICAL CLEANUP LOOP (Fail-Safe Version with try/except)
    
    # We look for tables, divs, uls, and ols inside the main content to clean up.
    for element in content_div.find_all(['table', 'div', 'ul', 'ol']):
        
        # Use a try/except block as the ultimate defense against the persistent AttributeError
        try:
            # Skip if the element is NOT a proper BeautifulSoup Tag object
            if not isinstance(element, Tag):
                continue 
            
            # These lines were crashing before, but are now safely wrapped
            role = element.get('role') 
            element_class = element.get('class', [])

            # Decompose common non-text elements (infoboxes, navigation menus, tables, lists)
            if role in ['navigation'] or 'infobox' in element_class:
                element.decompose()
            elif element.name in ['table', 'ul', 'ol']:
                element.decompose()
        
        except AttributeError:
            # If element.get() or any other Tag method fails, we skip it and continue the loop.
            continue 

    # 5. Extract and Concatenate Paragraph Text
    paragraphs = content_div.find_all('p')
    # Join only paragraphs that contain actual visible text
    clean_text = ' '.join(p.get_text() for p in paragraphs if p.get_text().strip())

    # 6. Content Limiting
    MAX_CHARS = 10000 
    if len(clean_text) > MAX_CHARS:
        clean_text = clean_text[:MAX_CHARS]
            
    return title, clean_text