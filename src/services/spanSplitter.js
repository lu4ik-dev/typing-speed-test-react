export async function spanSplitter(text, element, charStatus) {
    element.textContent = '';
    const words = text.split(' ');

    let index = 0;

    words.forEach((word) => {
        const wordSpan = document.createElement('div');
        wordSpan.style.marginRight = '1rem';

        word.split('').forEach((char) => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            if (charStatus[index] === 'correct') {
                charSpan.classList.remove();
                charSpan.classList.add('span-text');
                charSpan.classList.add('correct'); 
            } else if (charStatus[index] === 'incorrect') {
                charSpan.classList.remove();
                charSpan.classList.add('span-text');
                charSpan.classList.add('incorrect');
            } else {
                charSpan.classList.remove();
                charSpan.classList.add('span-text');
                charSpan.classList.add('default');
            }

            charSpan.setAttribute('data-index', index);
            wordSpan.appendChild(charSpan);
            index++;
        });

        element.appendChild(wordSpan);
        element.appendChild(document.createTextNode(' '));
        index++;
    });
}
