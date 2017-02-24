/**
 *
 * This plugin generates an empty textarea and collects submitted answers and response_time
 *
 */
jsPsych.plugins['spellcheck'] = (function(){

  var plugin = {
  };

  plugin.trial = function(display_element, trial){

  function checkword(word){
    var timeline = [];
    var is_spelled_correctly = dictionary.check( word );
    //var resultsContainer ;
    display_element = jsPsych.getDisplayElement();
   //display_element.html( '' );
    if(word != is_spelled_correctly){
  //  while(word != is_spelled_correctly){
       var array_of_suggestions = dictionary.suggest( word );
       display_element.append( $( '<center>' ).append( 'word mispelled, suggetions:' ));
       display_element.append( $( '<center>' ).append( $( '<code>' ).text( array_of_suggestions.join( ', ' ) ) ) );
       timeline.push(spellcheck);
    }
  }

  var dictionary = trial.dictionary;
  console.log(dictionary.check( 'word' ))

  display_element.append($('<div>', {
      'id': 'jspsych-spellcheck',
      'class': 'center-content block-center'
    }));

    //display_element.append('<textarea class="center-content">')
    $("#jspsych-spellcheck").append('<textarea class = "block-center" id="message">')

     $("#jspsych-spellcheck").append($('<button>', {
       'id': 'jspsych-survey-text-next',
       'class': 'block-center'
     }));
    // $("#jspsych-survey-text-next").append($( '<center>' ).text('Submit Answers!'));

     $("#jspsych-survey-text-next").append('Submit Answers!');
     //$("#jspsych-survey-text-next").append('<center>'+'Submit Answers!!'+'</center>');
     $("#jspsych-survey-text-next").click(function() {
       // measure response time
       var endTime = (new Date()).getTime();
       var response_time = endTime - startTime;

       var question_data = {};
       var val = $("#message").val();  //get data typed in textarea
       $.extend(question_data);
      //   console.log(val);

       // save data
       var trialdata = {
         "rt": response_time,
         "responses": val
       };

       display_element.html('');
       // next trial
       if(val == dictionary.check( val )){
         jsPsych.finishTrial(trialdata);
       } else{
         display_element.append('Error!');
       }

     });

     var startTime = (new Date()).getTime();
   };
  return plugin;
})();
