import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Map "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {

  public shared (msg) func whoami() : async Principal {
    msg.caller;
  };

  type Post = {
    author : Principal;
    content : Text;
  };

  func natHash(n : Nat) : Hash.Hash {
    Text.hash(Nat.toText(n));
  };

  var posts = Map.HashMap<Nat, Post>(0, Nat.equal, natHash);
  var nextId : Nat = 0;

  public shared (msg) func addPost(content : Text) : async Nat {
    let id = nextId;
    posts.put(id, { author = msg.caller; content = content });
    nextId += 1;
    id;
  };

  public query func getPosts() : async [Post] {
    Iter.toArray(posts.vals());
  };

};
