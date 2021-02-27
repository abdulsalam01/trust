import { generateTree } from ".";
import { Schema } from "./schema";

const ContactsSchema = Schema.Factory((prop) => {
  prop("mobile").isString();
  prop("phone").isString();
});

const FriendSchema = Schema.Factory((prop) => {
  prop("name").isString().minLength(10);
  prop("rating").isString("Rating should be a string");
  prop("hobbies").validateEach().isString();
});

const UserSchema = Schema.Factory((prop) => {
  prop("name").isString();
  prop("contacts").useSchema(ContactsSchema);
  prop("friends").useSchema(FriendSchema).validateEach();
  prop("email").minLength(20);
});

const validationResult = UserSchema.validate({
  name: "billy",
  contacts: {
    mobile: 0,
    phone: 0,
  },
  friends: [
    { name: "Billy189273123", rating: 10, hobbies: [] },
    { name: 0, rating: "29712373" },
  ],
}).filter((v) => v.isError);

console.log(validationResult);

// you can also generate tree
console.log(JSON.stringify(generateTree(validationResult), null, 2));
