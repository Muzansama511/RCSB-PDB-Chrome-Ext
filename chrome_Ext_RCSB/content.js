function getElementTextByXPath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const element = result.singleNodeValue;
  
    if (element) {
      return element.click(); 
    } else {
      return null; // Or throw an error
    }
  }

function clickUniProtLink() {
    // Click on the UniProt link
    window.addEventListener('DOMContentLoaded', () => {
        getElementTextByXPath('/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[5]/td/div[1]/a')
    });
    // getElementTextByXPath('/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[5]/td/div[1]/a')
};
  // Listen for messages from the background script
document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.tabs.create({ url: `https://www.rcsb.org/structure/1A0S` });

    if (request.action === 'activate') {
      clickUniProtLink();
      chrome.tabs.create({ url: `https://www.rcsb.org/structure/1A0S` });
    }
  });
})