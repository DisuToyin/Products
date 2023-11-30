import supertest from "supertest";
import app from "../src/index";

const request = supertest(app);

const testUserData = {
  email: "johndoe@example.com",
  password: "Pasword@123",
};

const testPostData = {
  id: -1,
  title: "My Post Title",
  content: "My post content",
};

test("Should login user", async () => {
  return request
    .post("/login")
    .send({ email: testUserData.email, password: testUserData.password })
    .expect(200);
});
