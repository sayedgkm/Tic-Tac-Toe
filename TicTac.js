var board = [];
var computerLetter;
var humanLetter;
var turn = "x";
var isGameOver = 0;


$(document).ready(function(e){
  $(document).on('click','#start-game',function () {
    initialize();
  });
  $(document).on('click','.back',function () {
     $('.board').hide();
     $('#status').hide();
     $('.homepage').show();
  });
  $(document).on('click','.cell', function(){
    var id = $(this).attr('id');
    var x = id[0]-'0';
    var y = id[1]-'0';
    if(isValidMove(x,y)) {
      $(this).html(humanLetter);
      board[x][y] = humanLetter;
      if(isHumanWin(board)) {
        isGameOver = true;
        $("#status").html("You have won!");
        $("#status").show();
      } else if(isFull(board)) {
        isGameOver = true;
        $("#status").html("Game drawn. Try again to beat me.");
        $("#status").show();
      }
    }
    pcMove();
  });
   $('.board').hide();
});


function initialize() {
  board = [];
  $(".homepage").hide();
  $('#status').hide();
  $('.board').show();
  isGameOver = 0;

  board.push(["-", "-", "-"]);
  board.push(["-", "-", "-"]);
  board.push(["-", "-", "-"]);

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      $("#" + i + "" + j).html("");
    }
  }

  humanLetter = $('#letter-choose').find('select :selected').text().trim();
  if(humanLetter=='O') computerLetter = "X";
  else computerLetter = "O";
  if($('#first-move').find('select :selected').text().trim()=="Computer"){
    pcMove();
  }
}

function isFull(testBoard) {
  var full = 1;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (testBoard[i][j] == "-") {
        full = 0;
        break;
      }
    }
    if(!full) {
      break;
    }
  }
  return full;
}
function isPcWin(testBoard) {
  for(var i = 0;i<3;i++) {
    var isWin = 1;
    for(var j =0 ;j<3;j++) {
        isWin &= (testBoard[i][j] == computerLetter);
    }
    if(isWin) return true;
    isWin = 1;
    for(var j =0 ;j<3;j++) {
      isWin &= (testBoard[j][i] == computerLetter);
    }
    if(isWin) return true;
  }
  var isWin = 1;
  for(var i = 0;i<3;i++){
      isWin &= (testBoard[i][i]==computerLetter);
  }
  if(isWin) return true;
  isWin = 1;
  for(var i = 0;i<3;i++){
    isWin &= (testBoard[i][3-i-1]==computerLetter);
  }
  if(isWin) return true;
  return false;
}
function isHumanWin(testBoard) {
  for(var i = 0;i<3;i++) {
    var isWin = 1;
    for(var j =0 ;j<3;j++) {
        isWin &= (testBoard[i][j] == humanLetter);
    }
    if(isWin) return true;
    isWin = 1;
    for(var j =0 ;j<3;j++) {
      isWin &= (testBoard[j][i] == humanLetter);
    }
    if(isWin) return true;
  }
  var isWin = 1;
  for(var i = 0;i<3;i++){
      isWin &= (testBoard[i][i]==humanLetter);
  }
  if(isWin) return true;
  isWin = 1;
  for(var i = 0;i<3;i++){
    isWin &= (testBoard[i][3-i-1]==humanLetter);
  }
  if(isWin) return true;
  return false;
}
function pcMove() {
  if(isGameOver) return;
  var tempBoard = [];
  for(var i = 0;i<3;i++) {
      tempBoard.push(board[i]);
  }
  var bestMove = getBestMove(tempBoard);
  var x = bestMove.X;
  var y = bestMove.Y;
  board[x][y] = computerLetter;
  $("#"+ x + "" + y ).html(computerLetter);
  if(isPcWin(board)) {
    isGameOver = true;
    $("#status").html("You have lost. Better luck next time.");
    $("#status").show();
  } else if(isFull(board)) {
    isGameOver = true;
    $("#status").html("Game drawn. Try again to beat me.");
    $("#status").show();
  }
}
function isValidMove(x,y) {
  return board[x][y] == "-"&&isGameOver==0;
}

function getBestMove(tempBoard) {

  var x = -1,y = -1;
  var bestScore = -100; 
  
  for(var i = 0;i<3;i++) {
    for(var j = 0;j<3;j++) {
       if(tempBoard[i][j]=="-") {
         tempBoard[i][j] = computerLetter; //// trying all possible move and evaluating minimax scores 
         var score = miniMax(tempBoard,0);
         if(score>bestScore) {
           bestScore = score;
           x = i;
           y = j;
         }
         tempBoard[i][j] = "-";  //// Undo previous move 
       }
    }
  }
  return {X: x , Y: y};
}

function miniMax(tempBoard,isPcMove) {
    if(isHumanWin(tempBoard)) {
         return -10;
    }
    if(isPcWin(tempBoard)) {
        return 10;
    }
    if(isFull(tempBoard)) {
      return 0 ;
    }

    if(isPcMove) {
      var bestScore = -100;
      for(var i = 0;i<3;i++) {
        for(var j = 0;j<3;j++) {
          if(tempBoard[i][j] == "-") {
            tempBoard[i][j] = computerLetter;
            bestScore = Math.max(bestScore,miniMax(tempBoard,!isPcMove));
            tempBoard[i][j] = "-";
          }
        }
      }
      return bestScore;
    } else {

      var bestScore = 100;
      for(var i = 0;i<3;i++) {
        for(var j = 0;j<3;j++) {
          if(tempBoard[i][j] == "-") {
            tempBoard[i][j] = humanLetter;
            bestScore = Math.min(bestScore,miniMax(tempBoard,!isPcMove));
            tempBoard[i][j] = "-";
          }
        }
      }
      return bestScore;
    }

}









