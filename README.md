# pk-bot

### [Invite Link](https://discord.com/oauth2/authorize?client_id=745454805954199683&scope=bot&permissions=3136)
Discord bot for Quizbowl pks.

This bot was made to remedy some features that I thought were basic to studying but locked behind a paywall in Everclue in addition to the fact that the multiplayer functionality on Everclue was bugged. 

The main feature this bot has over Everclue is that you can select both a category and a difficulty(also the multiplayer function but I expect Rajas to fix that at some point). In addition, pk-bot offers these features for free forever.

The table below displays the advantages and disadvantages to using each as of 08/30/2020.

(If anything in here is wrong please dm me on Discord at bubblebyb#4513)



| Features                  | pk-bot | Everclue Free | Everclue Premium |
|---------------------------|--------|---------------|------------------|
| Singleplayer pks          | ✔️      | ✔️             | ✔️                |
| Multiplayer pks           | ✔️      | <a href="#footnote1">✔️<sup>*</sup></a>             | <a href="#footnote1">✔️<sup>*</sup></a>                |
| tks           |       |  | ✔️               |
| Choosing Difficulty       | ✔️      | ✔️             | ✔️                |
| Choosing Category         | ✔️      | ✔️             | ✔️                |
| Choosing Tournament       |        | ✔️             | ✔️                |
| Choosing Year             |        | ✔️             | ✔️                |
| Choosing Multiple Filters | ✔️      |               | ✔️                |
| Changing Distribution     |        |               | ✔️                |
| Wikipedia Links           | <a href="footnote2">✔️<sup>†</sup></a>      | <a href="footnote2">✔️<sup>†</sup></a>           | <a href="footnote2">✔️<sup>†</sup></a>                |
| Price                     | Free   | Free          |    $9.99 - $14.99              |


<hr>
<sup id="footnote1">*</sup> As of 08/30/2020, the multiplayer function on Everclue is not working and crashes after three bonus questions. The chart will be updated if and when the problem is fixed.

<sup id="footnote2">†</sup> I have no idea what Everclue uses to grab Wikipedia links but it looks like it just plugs the answerline into a wikipeida link (sometimes including the question's dedication.) For example, the answerline [Hugh "Blazes" Boylan from Penn Bowl 2014](http://www.quizdb.org/?query=Ulysses&question_type%5B0%5D=Bonus&difficulty%5B0%5D=regular_college&tournament%5B0%5D=46) returns [this link](https://en.wikipedia.org/wiki/Hugh_"Blazes"_Boylan__<AR). On the other hand, pk-bot uses the Wikipedia API to search Wikipedia for the answerline(after stripping prompts like Everclue but also stripping dedications unlike Everclue) and embeds the link to the first result. This method also has its disadvantages as it can create incorrect links. For example, the for the Polish-Lithuanian Deluge will grab the Wikipedia link for the Genesis Flood Story instead for the right article.
