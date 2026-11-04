const createElement = (arr) => {
const htmlElement = arr.map((el) => `<span class = "btn"> ${el} </span>`);
    return htmlElement.join(" ");
}

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const manageSpin = (status) => {
    if (status == true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }
    else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

const loadLessons = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((response) => response.json())
        .then((json) => displayLesson(json.data));
}

const removeActive = () =>{
    const lessonBtn = document.querySelectorAll(".lesson-btn");
    lessonBtn.forEach((buttons) =>{
        buttons.classList.remove("active");
    })
}

const loadLevelWord = (id) =>{
    manageSpin(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    console.log(url);
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            removeActive();
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("active");
            console.log(clickBtn);
            displayWord(data.data)});
}

const loadWordDetails = async(id) =>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const response = await fetch(url);
    const details = await response.json();
    displayWordDetails(details .data);
}

const displayLesson = (lessons) => {
        const levelContainer = document.getElementById("level-container");
        levelContainer.innerHTML = "";
        for (const lesson of lessons){
            const divBtn = document.createElement("div");
            divBtn.innerHTML = `
                <button id = "lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class = "btn btn-outline btn-primary mt-5 lesson-btn">
                <i class="fa-solid fa-book-open"></i>Lesson -${lesson.level_no}
                </button>
            `;
            levelContainer.append(divBtn);
        }
}

const displayWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";
    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white text-center  rounded-xl shadow-sm py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "কোনো শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-semibold text-lg">Meaning / Pronunciation</p>
            <div class="font-bangla font-bold text-2xl text-neutral/50">"${word.meaning ? word.meaning : "কোনো শব্দের অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "কোনো শব্দের উচ্চারণ পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick = "loadWordDetails(${word.id})" class="bg-blue-100 p-3 rounded-md hover:bg-blue-400"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick = "pronounceWord('${word.word}')" class="bg-blue-100 p-3 rounded-md hover:bg-blue-400"><i class="fa-solid fa-volume"></i></button>
            </div>
        </div>
        `;
        wordContainer.append(card);
    })
    manageSpin(false);
}

const displayWordDetails = (word) => {
    const detailsContainer = document.getElementById("word-details-container");
    detailsContainer.innerHTML = `
                <div>
                    <h2 class="font-bold text-3xl"> ${word.word} ( <i class="fa-solid fa-microphone-lines"></i> : <span
                            class="font-bangla"> ${word.pronunciation} </span> )</h2>
                </div>
                <div>
                    <h3 class="text-xl font-semibold">Meaning</h3>
                    <p class="font-bangla"> ${word.meaning} </p>
                </div>
                <div>
                    <h3 class="text-xl font-semibold">Example</h3>
                    <p> ${word.sentence} </p>
                </div>
                <div>
                    <h3 class="text-xl font-semibold mb-3">Synonyms</h3>
                    <div> ${createElement(word.synonyms)} </div>
                </div>   
    `;
    document.getElementById("my_modal").showModal();
}

document.getElementById("search-btn").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("search-input");
    const searchValue = input.value.trim().toLowerCase();

    const url = "https://openapi.programming-hero.com/api/words/all";
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const allData = data.data;
        const filterWord = allData.filter(word => word.word.toLowerCase().includes((searchValue)));
        displayWord(filterWord);
    })

})
loadLessons();