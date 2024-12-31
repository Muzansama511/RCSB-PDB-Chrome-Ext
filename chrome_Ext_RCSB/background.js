// This function logs when the extension is installed or updated

function containsNumber(str) {
  return !isNaN(parseFloat(str)) && (str.toLowerCase!='inf');
}
function getElementTextByXPath(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  const element = result.singleNodeValue;

  if (element) {
    return element.textContent; 
  } else {
    return null; // Or throw an error
  }
}

  // chrome.omnibox.onInputEntered.addListener((text) => {
  //   if (text.length ==4 && containsNumber(text)) {
  //     const url = `https://www.rcsb.org/structure/${text}`;
  //     chrome.tabs.create({ url: url }, (tab) => {
  //       });
  //   } else {
  //   const url = `https://www.rcsb.org/search?request=%7B"query"%3A%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"terminal"%2C"service"%3A"full_text"%2C"parameters"%3A%7B"value"%3A"${text}"%7D%7D%5D%2C"logical_operator"%3A"and"%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"full_text"%7D%5D%2C"logical_operator"%3A"and"%7D%2C"return_type"%3A"entry"%2C"request_options"%3A%7B"paginate"%3A%7B"start"%3A0%2C"rows"%3A25%7D%2C"results_content_type"%3A%5B"experimental"%5D%2C"sort"%3A%5B%7B"sort_by"%3A"score"%2C"direction"%3A"desc"%7D%5D%2C"scoring_strategy"%3A"combined"%7D%2C"request_info"%3A%7B"query_id"%3A"9d3850430c3de787e8f91e9b79224261"%7D%7D`;
  //   chrome.tabs.create({ url: url }, (tab) => {
  //     });
  //   }
  // });

  chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    // Provide suggestions based on input
    const commands = [
      { content: "ID", description: "Search the PDB ID" },
      { content: "download pdb", description: "Download a PDB file" },
      { content: "download cif", description: "Download a CIF file" },
      { content: "similar search", description: "Search similar proteins using UniProt ID" }
    ];
  
    const matches = commands.filter(command => command.content.toLowerCase().startsWith(text.toLowerCase()));
    suggest(matches);
  });
  
  chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    // Handle input based on the command
    text = text.toLowerCase();
    if (text.startsWith("download pdb ")) {
      const query = text.replace("download pdb ", "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4}$/.test(query)) {
        window.alert("Invalid PDB ID. PDB IDs are 4 alphanumeric characters.");
        return;
      }
      chrome.tabs.create({ url: `https://files.rcsb.org/download/${query}.pdb` });
    } else if (text.startsWith("download cif ")) {
      const query = text.replace("download cif ", "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4}$/.test(query)) {
        alert("Invalid PDB ID. PDB IDs are 4 alphanumeric characters.");
        return;
      }
      chrome.tabs.create({ url: `https://files.rcsb.org/download/${query}.cif` });
    } else if (text.toUpperCase().startsWith("ID ")) {
      const query = text.toUpperCase().replace("ID ", "").trim()
      if (!/^[A-Z0-9]{4}$/.test(query)) {
        window.prompt("Invalid PDB ID. PDB IDs are 4 alphanumeric characters.");
        return;
      }
      chrome.tabs.create({ url: `https://www.rcsb.org/structure/${query}` });
    } else if (text.startsWith("similar search ")){
      const query = text.replace("similar search ", "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4}$/.test(query)) {
        window.prompt("Invalid PDB ID. PDB IDs are 4 alphanumeric characters.");
        return;
      }
      // async () =>{ fetch(`https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${query}`);}
      fetch(`https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${query}`).then(response => response.json()).then(data => {
        // chrome.tabs.create({ url: `https://www.google.com`});
        // chrome.tabs.create({ url: `https://www.google.com/search?client=opera&q=${encodeURIComponent(JSON.stringify((Object.keys(data['"1asc"']['"UniProt']))))}&sourceid=opera&ie=UTF-8&oe=UTF-8` });
        let up = data[Object.keys(data)[0]]
        let uni_id = Object.keys(up[Object.keys(up)[0]])[0].replace('"', '');

        // chrome.tabs.create({ url: `https://www.google.com/search?client=opera&q=${encodeURIComponent(JSON.stringify((Object.keys(up[Object.keys(up)[0]])[0])))}&sourceid=opera&ie=UTF-8&oe=UTF-8` });
      
        chrome.tabs.create({ url: `https://www.rcsb.org/search?request=%7B"query"%3A%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"terminal"%2C"service"%3A"text"%2C"parameters"%3A%7B"attribute"%3A"rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession"%2C"negation"%3Afalse%2C"operator"%3A"in"%2C"value"%3A%5B"${uni_id}"%5D%7D%7D%2C%7B"type"%3A"terminal"%2C"service"%3A"text"%2C"parameters"%3A%7B"attribute"%3A"rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_name"%2C"negation"%3Afalse%2C"operator"%3A"exact_match"%2C"value"%3A"UniProt"%7D%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"nested-attribute"%7D%5D%2C"logical_operator"%3A"and"%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"text"%7D%5D%2C"logical_operator"%3A"and"%7D%2C"return_type"%3A"entry"%2C"request_options"%3A%7B"paginate"%3A%7B"start"%3A0%2C"rows"%3A25%7D%2C"results_content_type"%3A%5B"experimental"%5D%2C"sort"%3A%5B%7B"sort_by"%3A"score"%2C"direction"%3A"desc"%7D%5D%2C"scoring_strategy"%3A"combined"%7D%2C"request_info"%3A%7B"query_id"%3A"93583666cd9b95c3c342e995a8554f39"%7D%7D` });
      }); 
      
      // chrome.tabs.create({ url: `https://www.rcsb.org/structure/${query}` }, (tab) =>{
      //   chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      //     if (tabId === tab.id && changeInfo.status === 'complete') { 
      //       chrome.tabs.onUpdated.removeListener(listener);
      //       chrome.tabs.create({ url: `https://www.google.com` });
      //       let text = getElementTextByXPath('/html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[5]/td/div[1]/a');
      //       // /html/body/div[1]/div[3]/div[2]/div[2]/div[2]/div/div/div/div[2]/table/tbody/tr[5]/td/div[1]/a
      //       chrome.tabs.create({ url: `https://www.google.com/search?client=opera&q=${encodeURIComponent(JSON.stringify(text))}&sourceid=opera&ie=UTF-8&oe=UTF-8` });
      //     };
      //   });
      //   // chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      //   //   if (activeTab.id === tab.id) { // Ensure we're checking the correct tab
      //   //     chrome.tabs.create({ url: `https://www.google.com/search?client=opera&q=${encodeURIComponent(JSON.stringify(activeTab))}&sourceid=opera&ie=UTF-8&oe=UTF-8` });

      //   //   }
      //   // });



      //   // chrome.tabs.create({ url: `https://www.google.com/search?client=opera&q=${encodeURIComponent(JSON.stringify(tab))}&sourceid=opera&ie=UTF-8&oe=UTF-8` });
      //   // chrome.tabs.create({ url: `https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${query}` });
      // });
      // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      //   // console.log('HELP',tabs);
      //   // chrome.tabs.create({ url: `https://www.rcsb.org/structure/1A0S` });
      //   chrome.tabs.sendMessage(tabs[0].id, { action: 'activate' });
      // });
      // const response = fetch(`https://www.ebi.ac.uk/pdbe/api/mappings/uniprot/${query}`);
      // const data = response.json();
      // console.warn(data);
      // const uni_id = data[query.toLowerCase()].UniProt[0]
      // let u = `https://www.rcsb.org/search?request=%7B"query"%3A%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"terminal"%2C"service"%3A"text"%2C"parameters"%3A%7B"attribute"%3A"rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession"%2C"negation"%3Afalse%2C"operator"%3A"in"%2C"value"%3A%5B"${uni_id}"%5D%7D%7D%2C%7B"type"%3A"terminal"%2C"service"%3A"text"%2C"parameters"%3A%7B"attribute"%3A"rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_name"%2C"negation"%3Afalse%2C"operator"%3A"exact_match"%2C"value"%3A"UniProt"%7D%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"nested-attribute"%7D%5D%2C"logical_operator"%3A"and"%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"text"%7D%5D%2C"logical_operator"%3A"and"%7D%2C"return_type"%3A"entry"%2C"request_options"%3A%7B"paginate"%3A%7B"start"%3A0%2C"rows"%3A25%7D%2C"results_content_type"%3A%5B"experimental"%5D%2C"sort"%3A%5B%7B"sort_by"%3A"score"%2C"direction"%3A"desc"%7D%5D%2C"scoring_strategy"%3A"combined"%7D%2C"request_info"%3A%7B"query_id"%3A"4a8f13aaa9e3ab4a53f189accf2d5712"%7D%7D`;
      // chrome.tabs.create({ url: u });
    } else {
      let u = `https://www.rcsb.org/search?request=%7B"query"%3A%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"group"%2C"nodes"%3A%5B%7B"type"%3A"terminal"%2C"service"%3A"full_text"%2C"parameters"%3A%7B"value"%3A"${encodeURIComponent(text)}"%7D%7D%5D%2C"logical_operator"%3A"and"%7D%5D%2C"logical_operator"%3A"and"%2C"label"%3A"full_text"%7D%5D%2C"logical_operator"%3A"and"%7D%2C"return_type"%3A"entry"%2C"request_options"%3A%7B"paginate"%3A%7B"start"%3A0%2C"rows"%3A25%7D%2C"results_content_type"%3A%5B"experimental"%5D%2C"sort"%3A%5B%7B"sort_by"%3A"score"%2C"direction"%3A"desc"%7D%5D%2C"scoring_strategy"%3A"combined"%7D%2C"request_info"%3A%7B"query_id"%3A"9d3850430c3de787e8f91e9b79224261"%7D%7D`;
      chrome.tabs.create({ url: u });
    }
  });
  