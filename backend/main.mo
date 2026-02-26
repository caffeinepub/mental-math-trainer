import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Random "mo:core/Random";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

actor {
  public type Problem = {
    question : Text;
    correctAnswer : Int;
    operation : Operation;
  };

  public type Operation = {
    #addition;
    #subtraction;
    #multiplication;
    #division;
  };

  public type Score = {
    name : Text;
    numCorrect : Nat;
    timestamp : Time.Time;
  };

  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      Nat.compare(score2.numCorrect, score1.numCorrect);
    };
  };

  let scores = List.empty<Score>();

  public shared ({ caller }) func generateProblem() : async Problem {
    let random = Random.crypto();
    let operationInt = await* random.natRange(0, 4); // Corrected to inclusive lower, exclusive upper
    let operation = switch (operationInt) {
      case (0) { #addition };
      case (1) { #subtraction };
      case (2) { #multiplication };
      case (3) { #division };
      case (_) { Runtime.trap("Invalid operation"); };
    };

    let operand1 = await* random.natRange(1, 101); // 100 inclusive
    let operand2 = await* random.natRange(1, 101);

    switch (operation) {
      case (#addition) {
        {
          question = operand1.toText() # " + " # operand2.toText();
          correctAnswer = operand1 + operand2;
          operation;
        };
      };
      case (#subtraction) {
        {
          question = operand1.toText() # " - " # operand2.toText();
          correctAnswer = operand1 - operand2;
          operation;
        };
      };
      case (#multiplication) {
        {
          question = operand1.toText() # " × " # operand2.toText();
          correctAnswer = operand1 * operand2;
          operation;
        };
      };
      case (#division) {
        let dividend = operand1 * operand2;
        {
          question = dividend.toText() # " ÷ " # operand2.toText();
          correctAnswer = operand1;
          operation;
        };
      };
    };
  };

  public shared ({ caller }) func submitScore(name : Text, numCorrect : Nat) : async () {
    let timestamp = Time.now();
    let score = {
      name = if (name.isEmpty()) { "Anonymous" } else { name };
      numCorrect;
      timestamp;
    };
    scores.add(score);
  };

  public query ({ caller }) func getLeaderboard() : async [Score] {
    let scoresArray = scores.toArray();
    let sorted = scoresArray.sort();
    let size = sorted.size();
    let end = Nat.min(10, size);

    Array.tabulate<Score>(end, func(i) { sorted[i] });
  };
};
