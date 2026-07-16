/* ==========================================
   TEKNOSALIN v3
   dictionary.js
========================================== */

let terms = [];
let filteredTerms = [];
let currentTerm = null;

// ================= ELEMENTS =================

const searchInput = document.getElementById("searchInput");

const termList = document.getElementById("termList");

const termCount = document.getElementById("termCount");

const englishTerm = document.getElementById("englishTerm");
const filipinoTerm = document.getElementById("filipinoTerm");

const category = document.getElementById("category");
const symbol = document.getElementById("symbol");
const formula = document.getElementById("formula");
const unit = document.getElementById("unit");

const definition = document.getElementById("definition");
const example = document.getElementById("example");

const related = document.getElementById("related");

const difficulty = document.getElementById("difficulty");

const didYouKnow = document.getElementById("didYouKnow");

// ================= SAFE =================

function safe(value){

    if(
        value===undefined ||
        value===null ||
        value===""

    ){

        return "—";

    }

    return value;

}

// ================= LOAD JSON =================

async function loadDictionary(){

    try{

        const response = await fetch("data/terms.json");

        if(!response.ok){

            throw new Error("Unable to load terms.json");

        }

        terms = await response.json();

        terms.sort((a,b)=>

            a.english.localeCompare(b.english)

        );

        filteredTerms=[...terms];

        termCount.textContent=`${terms.length} Terms`;

        renderList(filteredTerms);

        if(filteredTerms.length>0){

            const params = new URLSearchParams(window.location.search);

            const keyword = params.get("search");
            const selectedCategory = params.get("category");

            // Filter by category first
            if (selectedCategory) {

                filteredTerms = terms.filter(term =>
                    term.category === selectedCategory
                );

                termCount.textContent = `${filteredTerms.length} Terms`;

                renderList(filteredTerms);

                if (filteredTerms.length > 0) {
                    showTerm(filteredTerms[0]);
                }

            }
            // Search
            else if (keyword) {

                searchInput.value = keyword;
                filterTerms();

            }
            // Default
            else {

                showTerm(filteredTerms[0]);

            }

        }

    }

    catch(error){

        console.error(error);

        termList.innerHTML=`

            <li>

                Failed to load dictionary.

            </li>

        `;

    }

}

// ================= RENDER SIDEBAR =================

function renderList(list){

    termList.innerHTML="";

    if(list.length===0){

        termList.innerHTML=`

            <li>

                No terms found.

            </li>

        `;

        return;

    }

    list.forEach(term=>{

        const li=document.createElement("li");

        li.className="term-item";

        if(currentTerm && currentTerm.id===term.id){

            li.classList.add("active");

        }

        li.innerHTML=`

            <div class="term-title">

                ${safe(term.english)}

            </div>

            <small>

                ${safe(term.filipino)}

            </small>

        `;

        li.onclick=()=>{

            showTerm(term);

        };

        termList.appendChild(li);

    });

}

// ================= SHOW TERM =================

function showTerm(term){

    currentTerm=term;

    englishTerm.textContent=safe(term.english);

    filipinoTerm.textContent=safe(term.filipino);

    category.textContent=safe(term.category);

    symbol.textContent=safe(term.symbol);

    formula.textContent=safe(term.formula);

    unit.textContent=safe(term.unit);

    definition.textContent=safe(term.definition);

    example.textContent=safe(term.example);

    difficulty.textContent=safe(term.difficulty);

    didYouKnow.textContent=safe(term.didYouKnow);

    renderRelated(term.related);

    renderList(filteredTerms);

}

// ================= RELATED TERMS =================

function renderRelated(items){

    related.innerHTML="";

    if(!items || items.length===0){

        related.textContent="—";

        return;

    }

    items.forEach(name=>{

        const btn=document.createElement("button");

        btn.className="related-btn";

        btn.textContent=name;

        btn.onclick=()=>{

            const found=terms.find(t=>

                t.english.toLowerCase()===name.toLowerCase()

            );

            if(found){

                showTerm(found);

            }

        };

        related.appendChild(btn);

    });

}

// ================= SEARCH =================

function filterTerms(){

    const keyword = searchInput.value
        .trim()
        .toLowerCase();

    filteredTerms = terms.filter(term=>{

        const text = [

            safe(term.english),
            safe(term.filipino),
            safe(term.category),
            safe(term.definition),
            safe(term.example)

        ].join(" ").toLowerCase();

        return text.includes(keyword);

    });

    termCount.textContent =
        `${filteredTerms.length} Terms`;

    renderList(filteredTerms);

    if(filteredTerms.length>0){

        showTerm(filteredTerms[0]);

    }else{

        englishTerm.textContent="No Results";
        filipinoTerm.textContent="";

        category.textContent="—";
        symbol.textContent="—";
        formula.textContent="—";
        unit.textContent="—";

        definition.textContent=
            "No matching electronics term found.";

        example.textContent="—";
        difficulty.textContent="—";
        didYouKnow.textContent="—";

        related.innerHTML="";

    }

}

// ================= EVENTS =================

searchInput.addEventListener("input",filterTerms);

// ================= KEYBOARD NAVIGATION =================

document.addEventListener("keydown",(e)=>{

    if(filteredTerms.length===0) return;

    if(!currentTerm) return;

    let index = filteredTerms.findIndex(

        t=>t.id===currentTerm.id

    );

    if(e.key==="ArrowDown"){

        e.preventDefault();

        index++;

        if(index>=filteredTerms.length){

            index=0;

        }

        showTerm(filteredTerms[index]);

    }

    if(e.key==="ArrowUp"){

        e.preventDefault();

        index--;

        if(index<0){

            index=filteredTerms.length-1;

        }

        showTerm(filteredTerms[index]);

    }

});

// ================= AUTO SCROLL =================

const observer = new MutationObserver(()=>{

    const active = document.querySelector(

        "#termList li.active"

    );

    if(active){

        active.scrollIntoView({

            behavior:"smooth",

            block:"nearest"

        });

    }

});

observer.observe(termList,{

    childList:true

});

// ================= START =================

window.addEventListener("DOMContentLoaded",()=>{

    loadDictionary();

});

console.log(

    "TEKNOSALIN v3 Loaded Successfully"

);