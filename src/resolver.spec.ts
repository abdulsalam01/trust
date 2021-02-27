import resolver from "./resolver";

describe("resolver", () => {
  test("resolver returns correct data", () => {
    const person = {
      personalInformation: {
        name: "Billy",
        age: 23,
      },
      contacts: {
        phone: {
          mobile: "628123456",
        },
        emails: ["bllyanos@gmail.com", "billy.editiano@gmail.com"],
      },
      friends: [{ name: "boy" }, { name: "bill" }],
      date: new Date(),
    };
    const date = resolver(person, "date");
    const name: string = resolver(person, "personalInformation.name");
    const age: number = resolver(person, "personalInformation.age");
    const mobilePhone = resolver(person, "contacts.phone.mobile");
    const secondEmail = resolver(person, "contacts.emails.1");

    const secondFriendName = resolver(person, "friends.1.name");
    expect(date).toBe(person.date);
    expect(name).toBe(person.personalInformation.name);
    expect(age).toBe(person.personalInformation.age);
    expect(mobilePhone).toBe(person.contacts.phone.mobile);
    expect(secondEmail).toBe(person.contacts.emails[1]);
    expect(secondFriendName).toBe(person.friends[1].name);
  });
});
