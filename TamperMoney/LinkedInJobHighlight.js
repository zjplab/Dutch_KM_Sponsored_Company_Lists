// ==UserScript==
// @name         LinkedIn Company Matcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check if LinkedIn job company is in IND km sponsor list
// @author       JP Zhang
// @match        https://www.linkedin.com/jobs/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Fetch the IND km sponsor list (supposed to be a JSON file)
    $.getJSON('https://raw.githubusercontent.com/zjplab/Dutch_KM_Sponsored_Company_Lists/main/km_company.json', function(indCompanies) {

        // Run the check every 5 seconds
        setInterval(function() {
            // Find all company names in the page
            $('a.ember-view.t-black.t-normal').each(function() {
                let companyName = $(this).text().trim().toLowerCase();
                let location = $(this).closest('.jobs-unified-top-card__subtitle-primary-grouping')
                .find('.jobs-unified-top-card__bullet').text().trim();
                if (location.includes('Netherlands')) {
                    let companyLink = $(this); // Save the jQuery object for the company name link

                    console.time("Matching time"); // Start timer

                    let matched = indCompanies.sponsors.some(function(sponsor) {
                        if (isKMismatchSubstring(companyName, sponsor.toLowerCase(), 3)) {
                            // The company name is a K-mismatch substring of this company,
                            // so you can change the CSS as needed.
                            companyLink.css('font-weight', 'bold');
                            companyLink.css('color', 'green');
                            return true;
                        }
                        return false;
                    });

                    console.timeEnd("Matching time"); // End timer and log time

                    if (!matched) {
                        // The company name did not match any sponsor,
                        // so you can change the CSS as needed.
                        console.log("Not matched!");
                        companyLink.css('font-weight', 'bold');
                        companyLink.css('color', 'red');
                    }
                }
            });
        }, 5000);
    });
})();

function isKMismatchSubstring(query, text, k) {
    let m = query.length;
    for (let i = 0; i <= text.length - m; i++) {
        let mismatches = 0;
        for (let j = 0; j < m; j++) {
            if (text[i + j] !== query[j]) {
                mismatches++;
                if (mismatches > k) {
                    break;
                }
            }
        }
        if (mismatches <= k) {
            return true;
        }
    }
    return false;
}
