function strings(n, selectedQuestions) {
    selectedQuestions.bonuses[n].formatted_answers[0] = selectedQuestions.bonuses[n].formatted_answers[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].formatted_answers[1] = selectedQuestions.bonuses[n].formatted_answers[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].formatted_answers[2] = selectedQuestions.bonuses[n].formatted_answers[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/<\/?u>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].answers[0] = selectedQuestions.bonuses[n].answers[0].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].answers[1] = selectedQuestions.bonuses[n].answers[1].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].answers[2] = selectedQuestions.bonuses[n].answers[2].replace(/ *\([^)]*\) */g, ' ').replace(/ *\[[^)]* */g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/(<([^>]+)>)/gi, "").replace(/ANSWER: /g, '').trim();
    selectedQuestions.bonuses[n].formatted_leadin = selectedQuestions.bonuses[n].formatted_leadin.replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/\[/g, '(').replace(/]/g, ')');
    selectedQuestions.bonuses[n].formatted_texts[0] = selectedQuestions.bonuses[n].formatted_texts[0].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/\[/g, '(').replace(/]/g, ')');
    selectedQuestions.bonuses[n].formatted_texts[1] = selectedQuestions.bonuses[n].formatted_texts[1].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/\[/g, '(').replace(/]/g, ')');
    selectedQuestions.bonuses[n].formatted_texts[2] = selectedQuestions.bonuses[n].formatted_texts[2].replace(/<\/?strong>/g, '**').replace(/<\/?em>/g, '*').replace(/\[/g, '(').replace(/]/g, ')');
}

module.exports = {strings}