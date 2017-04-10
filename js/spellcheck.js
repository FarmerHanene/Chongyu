/**
 *
 * This plugin generates an empty textarea and does spellcheck
 * It collects submitted answers and their response_time (in milliseconds)
 * Also, it gets wrongResponse lists (one-character or missplled words, but not blanks) and the
 * corresponding wrongResponseRT lists
 *
 * Chongyu Yuan
 */
jsPsych.plugins['spellcheck'] = (function(){

  var plugin = {
  };

  plugin.trial = function(display_element, trial){

    trial.responseList = trial.responseList || [];

    function countInArray(array, what) { return array.filter(item => item == what).length; }

    var responseListKey = Array.from(frequencies(trial.responseList()).keys());
    var responseListValue = Array.from(frequencies(trial.responseList()).values());
    var examList = [];

    var finalResponse;
    var wrongResponse = [];
    var wrongResponseRT = [];

    function frequencies(a,x){
        return new Map(a.map(
          x  => [x, a.filter(y => y === x).length]
        ));
    }

    for(var i = 0; i < responseListKey.length; i++){
      if(responseListValue[i] >= trial.permitNumber){
        examList.push(responseListKey[i]);
      }
    }

    var dictionary;
    //	Loading affix data and English dictionary
    $.get( 'Typo.js/typo/dictionaries/en_US/en_US.aff', function ( affData ) {
    $.get( 'Typo.js/typo/dictionaries/en_US/en_US.dic', function ( wordsData ) {
    //	loading-progress', Initializing Typo
    dictionary = new Typo( "en_US", affData, wordsData );
    $('#jspsych-survey-text-next').attr('disabled', false); //enable the button once dictionary is loaded
      } );
    } );

  display_element.append($('<div>', {
      'id': 'jspsych-spellcheck',
      'class': 'center-content block-center'
      }));
  $("#jspsych-spellcheck").append('<textarea class = "block-center" id="message">')
  $("#jspsych-spellcheck").append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'block-center',
      'disabled': true   //disable the button by default
      }));
  $("#jspsych-survey-text-next").append('Submit Answer');
  $("#jspsych-survey-text-next").click(function() {
      // only show one line at a time
      $('#LEOneChar').remove();
      $('#empty').remove();
      $('#missplled').remove();
      $('#repetitive').remove();

       var endTime = (new Date()).getTime();
       var response_time = endTime - startTime; // measure response time
       var val = $("#message").val();  //get data typed in textarea

       var is_spelled_correctly = dictionary.check(val);

         if(!val) {
           display_element.append($('<div>',{
             "id": 'empty',
             "class": 'center-content',
             "html": '<br>' + 'Please type in your answer!'
           }));
         } else if(val.length <= 1) {
           wrongResponse.push(val);
           wrongResponseRT.push(response_time);
           display_element.append($('<div>',{
             "id": 'LEOneChar',
             "class": 'center-content',
             "html": '<br>' + 'Please enter a full word!'
           }));
         }
         else if (!is_spelled_correctly ){
             wrongResponse.push(val);
             wrongResponseRT.push(response_time);
             var array_of_suggestions = dictionary.suggest( val );
             display_element.append($('<div>',{
               "id": 'missplled',
               "class": 'center-content',
               "html": '<br>' + "Oops!" + '<br>' + "Suggetions for ''" + val + "':" + '<br>' +  array_of_suggestions.join( ', ' )
             }));
           }
          else if (examList.indexOf(val) >= 0){
            wrongResponse.push(val);
            wrongResponseRT.push(response_time);
            display_element.append($('<div>',{
              "id": 'repetitive',
              "class": 'center-content',
              "html": '<br>' + "You have already typed in '" + val + "'  " + trial.permitNumber + " times!" + '<br>' + "Please try another word!"
            }));
          }
          else {
             var trialdata = {
               "rt": response_time,
               "finalResponse": val,
               "questionNumber": trial.serialNumber + 1,
               "wrongAnswer": wrongResponse,
               "wrongAnswerRT": wrongResponseRT
             };
            console.log(trialdata);
            display_element.html('');
            jsPsych.finishTrial(trialdata);
          }
     });   //end of click function
     var startTime = (new Date()).getTime();
   };
  return plugin;
})();
