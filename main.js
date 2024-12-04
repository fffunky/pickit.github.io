let draggedItem = null;
let startContainer = null;
let question = null;
let options = [];
let userRanking = [];
let finalRanking = [];

// create some fake data
const fakeUserRankings = {
    'Person 1': ['1', '3', '4', '2'],
    'Person 2': ['2', '4', '1', '3'],
    'Person 3': ['4', '2', '3', '1'],
    'Person 4': ['2', '3', '4', '1'],
};

function dragStart() {
    draggedItem = this;
    startContainer = this.parentElement.id;
    document.documentElement.style.cursor = 'grabbing';
    setTimeout(() => this.className = 'dragging', 0);
}

function dragEnd() {
    document.documentElement.style.cursor = 'default';
    this.className = 'item';
    draggedItem = null;
}

function dragOver(e) {
    e.preventDefault();
    this.className = 'draggedOver';
}

function dragLeave() {
    this.className = 'choice'
}

function dragDrop() {
    const target = document.getElementById(startContainer);
    const swapItem = this.firstElementChild;
    target.append(swapItem);
    this.append(draggedItem);
    startContainer = null;
    this.className = 'choice';
}

function submitRanking() {
    const choiceDivs = document.querySelectorAll('.item');
    let choices = [];
    choiceDivs.forEach( choiceDiv => {
        choices.push(choiceDiv.getAttribute('data-id'));
    });
    return choices;
}

function getFinalRanking(userRanking) {
    points = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0
    };

    Object.values(fakeUserRankings).forEach(ranking => {
        let idx = 0;
        for (let i = 4; i > 0; i--) {
            points[ranking[idx]] += i;
            idx += 1
        }
    });

    let idx = 0;
    for (let i = 4; i > 0; i--) {
        points[userRanking[idx]] += i+i;
        idx += 1;
    }

    return points;

}

function fillRankings(userRanking) {
    finalRanking = getFinalRanking(userRanking);
    const resultDivs = document.querySelectorAll('.results');

    let winner = Math.max(...Object.values(finalRanking))

    idx = 0;
    for (let [item, pointValue] of Object.entries(finalRanking)) {
        let ranking = document.createElement("div")
        ranking.innerHTML = "item " + item;
        ranking.classList.add('ranking')
        
        if (pointValue === winner) {
            ranking.innerHTML += " (winner)";
            resultDivs[idx].classList.add('winner');
        }

        let pointDiv = document.createElement("div");
        pointDiv.innerHTML = "Total Points " + pointValue;
        pointDiv.classList.add('points');
        ranking.appendChild(pointDiv);
        resultDivs[idx].appendChild(ranking);
        idx += 1;
    }

    idx = 1;
    const userDivs = document.querySelectorAll('.user');
    console.log(userDivs);
    Object.keys(fakeUserRankings).forEach(user => {
        userDivs[idx].innerHTML = user;
        idx += 1;
    });

}

function undoRankings() {
    const resultDivs = document.querySelectorAll('.results');
    resultDivs.forEach(result => {
        result.removeChild(result.firstElementChild);
        result.classList.remove('winner');
    });
}

function hideSetupPage() {
    head0.classList.add('hidden');
    mainSection0.classList.add('hidden');
    sendBtn.classList.add('hidden');
}

function showFirstPage() {
    mainSection.classList.remove('hidden');
    btn.classList.remove('hidden');
    head1.classList.remove('hidden');
}

function hideFirstPage() {
    mainSection.classList.add('hidden');
    btn.classList.add('hidden');
    head1.classList.add('hidden');
}

function showSecondPage() {
    mainSection2.classList.remove('hidden');
    head2.classList.remove('hidden');
    backBtn.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    commentsContainer.classList.remove('hidden')
}

function hideSecondPage() {
    mainSection2.classList.add('hidden');
    head2.classList.add('hidden');
    backBtn.classList.add('hidden');
    saveBtn.classList.add('hidden');
    commentsContainer.classList.add('hidden')
    commentInput.value = '';
    undoRankings();
}

function addComment() {
    let newComment = document.createElement("p");
    newComment.classList = 'comment';
    let commentTxt = "Me: " + commentInput.value;

    if (commentTxt !== '') {
        newComment.innerHTML = commentTxt;
        commentsContainer.insertBefore(newComment, commentInput);
        commentInput.value = '';
    }

}
// section 0 elements
const sendBtn = document.querySelector('.send');
const mainSection0 = document.querySelector('.main0');
const head0 = document.querySelector('.head0');

// section 1 elements
const items = document.querySelectorAll('.item');
const itemContainer = document.querySelectorAll('.choice')
const btn = document.querySelector('.submit');
const mainSection = document.querySelector('.main');
const head1 = document.querySelector('.head1');

// section 2 elements
const mainSection2 = document.querySelector('.main2');
const head2 = document.querySelector('.head2');
const backBtn = document.querySelector('.back-btn');
const saveBtn = document.querySelector('.save-btn');
const commentsContainer = document.querySelector('.comments-container');
const commentInput = document.querySelector('.comment-input');
const commentBtn = document.querySelector('.comment-btn');

// section 0 events
sendBtn.addEventListener('click', () => {
    let proceed = true;

    question = document.querySelector('.question');
    options = document.querySelectorAll('.option');

    if (question.value === '') {
        question.style.border = '1px solid red';
        proceed = false;
    }

    options.forEach(option => {
        if (option.value === '') {
            option.style.border = '1px solid red';
            proceed = false;
        }
    });

    if (proceed) {
        idx = 0;
        items.forEach(item => {
            item.innerHTML = options[idx].value + item.innerHTML;
            idx += 1;
        })

        head1.innerHTML = question.value;
        hideSetupPage();
        showFirstPage();
    }
        

    

});

// section 1 events
btn.addEventListener('mousedown', () => {
    btn.classList.add('active');
});

btn.addEventListener('mouseup', () => {
    btn.classList.remove('active');
    userRanking = submitRanking();
    hideFirstPage();

    fillRankings(userRanking);
    showSecondPage();
});

items.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

itemContainer.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', dragDrop);
    container.addEventListener('dragleave', dragLeave);
});

// section 2 events
backBtn.addEventListener('click', () => {
    hideSecondPage();
    showFirstPage();
});

commentBtn.addEventListener('click', () => {
    addComment();
});