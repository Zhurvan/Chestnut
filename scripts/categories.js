function changeCategory(args, num) {
    args[num] = args[num].toLowerCase();
    switch (args[num]) {
        case 'ce':
            args[num] = 'Current Events';
            break;
        case 'fa':
            args[num] = 'Fine Arts';
            break;
        case 'sosc':
            args[num] = 'Social Science';
            break;
        case 'geo':
            args[num] = 'Geography';
            break;
        case 'hist':
            args[num] = 'History';
            break;
        case 'lit':
            args[num] = 'Literature';
            break;
        case 'myth':
            args[num] = 'Mythology';
            break;
        case 'philo':
            args[num] = 'Philosophy';
            break;
        case 'rel':
            args[num] = 'Religion';
            break;
        case 'sci':
            args[num] = 'Science';
            break;
        case 'amce':
            args[num] = 'Current Events American';
            break;
        case 'oce':
            args[num] = 'Current Events Other';
            break;
        case 'amfa':
            args[num] = 'Fine Arts American';
            break;
        case 'avfa':
            args[num] = 'Fine Arts Audiovisual';
            break;
        case 'afa':
            args[num] = 'Fine Arts Auditory';
            break;
        case 'britfa':
            args[num] = 'Fine Arts British';
            break;
        case 'efa':
            args[num] = 'Fine Arts European';
            break;
        case 'opfa':
            args[num] = 'Fine Arts Opera';
            break;
        case 'ofa':
            args[num] = 'Fine Arts Other';
            break;
        case 'vfa':
            args[num] = 'Fine Arts Visual';
            break;
        case 'amgeo':
            args[num] = 'Geography American';
            break;
        case 'worldgeo':
            args[num] = 'Geography World';
            break;
        case 'amhist':
            args[num] = 'History American';
            break;
        case 'brithist':
            args[num] = 'History British';
            break;
        case 'clhist':
            args[num] = 'History Classical';
            break;
        case 'eurohist':
            args[num] = 'History European';
            break;
        case 'ohist':
            args[num] = 'History Other';
            break;
        case 'worldhist':
            args[num] = 'History World';
            break;
        case 'amlit':
            args[num] = 'Literature American';
            break;
        case 'britlit':
            args[num] = 'Literature British';
            break;
        case 'cllit':
            args[num] = 'Literature Classical';
            break;
        case 'eurolit':
            args[num] = 'Literature European';
            break;
        case 'olit':
            args[num] = 'Literature Other';
            break;
        case 'worldlit':
            args[num] = 'Literature World';
            break;
        case 'ammyth':
            args[num] = 'Mythology American';
            break;
        case 'chimyth':
            args[num] = 'Mythology Chinese';
            break;
        case 'egymyth':
            args[num] = 'Mythology Egyptian';
            break;
        case 'grmyth':
            args[num] = 'Mythology Greco-Roman';
            break;
        case 'indmyth':
            args[num] = 'Mythology Indian';
            break;
        case 'japmyth':
            args[num] = 'Mythology Japanese';
            break;
        case 'omyth':
            args[num] = 'Mythology Other';
            break;
        case 'oeamyth':
            args[num] = 'Mythology Other East Asian';
            break;
        case 'amphilo':
            args[num] = 'Philosophy American';
            break;
        case 'clphilo':
            args[num] = 'Philosophy Classical';
            break;
        case 'eaphilo':
            args[num] = 'Philosophy East Asian';
            break;
        case 'euroPhilo':
            args[num] = 'Philosophy European';
            break;
        case 'ophilo':
            args[num] = 'Philosophy Other';
            break;
        case 'amrel':
            args[num] = 'Religion American';
            break;
        case 'chrel':
            args[num] = 'Religion Christianity';
            break;
        case 'earel':
            args[num] = 'Religion East Asian';
            break;
        case 'islam':
            args[num] = 'Religion Islam';
            break;
        case 'jewrel':
            args[num] = 'Religion Judaism';
            break;
        case 'orel':
            args[num] = 'Religion Other';
            break;
        case 'amsci':
            args[num] = 'Science American';
            break;
        case 'bio':
            args[num] = 'Science Biology';
            break;
        case 'chem':
            args[num] = 'Science Chemistry';
            break;
        case 'cs':
            args[num] = 'Science Computer Science';
            break;
        case 'math':
            args[num] = 'Science Math';
            break;
        case 'osci':
            args[num] = 'Science Other';
            break;
        case 'phys':
            args[num] = 'Science Physics';
            break;
        case 'worldsci':
            args[num] = 'Science World';
            break;
        case 'amsosc':
            args[num] = 'Social Science American';
            break;
        case 'anthro':
            args[num] = 'Social Science Anthropology';
            break;
        case 'econ':
            args[num] = 'Social Science Economics';
            break;
        case 'ling':
            args[num] = 'Social Science Linguistics';
            break;
        case 'ososc':
            args[num] = 'Social Science Other';
            break;
        case 'polisci':
            args[num] = 'Social Science Political Science';
            break;
        case 'psych':
            args[num] = 'Social Science Psychology';
            break;
        case 'socio':
            args[num] = 'Social Science Sociology';
            break;
        case 'amtrash':
            args[num] = 'Trash American';
            break;
        case 'movies':
            args[num] = 'Trash Movies';
            break;
        case 'music':
            args[num] = 'Trash Music';
            break;
        case 'otrash':
            args[num] = 'Trash Other';
            break;
        case 'sports':
            args[num] = 'Trash Sports';
            break;
        case 'tv':
            args[num] = 'Trash Television';
            break;
        case 'vg':
            args[num] = 'Trash Video Games';
    }
}
module.exports = {changeCategory}

module.exports = {changeCategory}