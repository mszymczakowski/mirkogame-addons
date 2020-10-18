// ==UserScript==
// @name         Mirkogame - SpyReportsHelper
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Shows last spy reports in galaxy view.
// @author       mszymczakowski
// @match        https://mirkogame.pl/**
// @grant        none
// ==/UserScript==

const STORAGE_KEY = "mirkogame_spyreports";
const LAST_SCAN_TEMPLATE_ELEMENT = "<div class='tooltip_sticky' data-tooltip-content=''><span class='scan-date'></span><br/><b><span class='last-activity'></span></b></div>";

function getLocalStorageData() {
    let result = localStorage.getItem(STORAGE_KEY);

    if (!result) {
        result = "{}";
        setLocalStorageData(result);
    }

    return JSON.parse(result);
}

function setLocalStorageData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function updateLocalStorage() {
    const reportElements = document.querySelectorAll(".spyRaport");
    const result = getLocalStorageData();

    for (let i = reportElements.length - 1; i >= 0; i--) {
        const reportElement = reportElements[i];

        const locationMatch = reportElement.querySelector(".spyRaportHead").innerText.match(/\[\d+:\d+:\d+]/);
        const lastActivityMatch = reportElement.querySelector(".spyRaportHead > div > b").innerText.match(/\((.+)\)/);
        const date = reportElement.parentElement.parentElement.previousElementSibling.querySelector("td:nth-child(2)").innerText;

        result[locationMatch[0]] = {
            date: date,
            lastActivity: lastActivityMatch ? lastActivityMatch[1] : "",
            html: reportElement.outerHTML
        };
    }

    setLocalStorageData(result);
}

function addOnMessagesDomChanged() {
    const container = document.querySelector("#content");

    if (container) {
        const observer = new MutationObserver(updateLocalStorage);
        observer.observe(container, {childList: true});

        window.addEventListener("beforeunload", function () {
            observer.disconnect();
        });
    }
}

function loadReportingData() {
    const reportingData = getLocalStorageData();
    const galaxyNumber = document.querySelector("input[name='galaxy']").value;
    const systemNumber = document.querySelector("input[name='system']").value;

    const mainTable = document.querySelector("#content > table");
    mainTable.querySelector("tbody > tr:first-of-type > th").setAttribute("colspan", "9");
    const headerRow = mainTable.querySelector("tbody > tr:nth-child(2)");
    const planetRows = mainTable.querySelectorAll("tbody > tr:nth-child(n+3):not(:nth-last-child(-n+5))");

    const newHeaderColumnElement = headerRow.querySelector("th:last-of-type").cloneNode(false);
    newHeaderColumnElement.innerText = "Ostatni skan";
    headerRow.insertBefore(newHeaderColumnElement, headerRow.querySelector("th:last-of-type"));

    for (let i = 0; i < planetRows.length; i++) {
        const planetRow = planetRows[i];
        const planetNumber = planetRow.querySelector("td:first-of-type").innerText;
        const lastScan = reportingData["[" + galaxyNumber + ":" + systemNumber + ":" + planetNumber + "]"];

        const newDataColumnElement = document.createElement("td");
        if (lastScan) {
            newDataColumnElement.innerHTML = LAST_SCAN_TEMPLATE_ELEMENT;
            newDataColumnElement.querySelector(".scan-date").innerText = lastScan.date;
            newDataColumnElement.querySelector(".last-activity").innerText = lastScan.lastActivity ? lastScan.lastActivity : "BRAK AKTYWNOŚCI";
            newDataColumnElement.querySelector("div").setAttribute("data-tooltip-content", lastScan.html);
        }
        planetRow.insertBefore(newDataColumnElement, planetRow.querySelector("td:last-of-type"));
    }
}

(function () {
    "use strict";

    if (/page=messages/.test(location.href)) {
        addOnMessagesDomChanged();
    } else if (/page=galaxy/.test(location.href)) {
        loadReportingData();
    }
})();