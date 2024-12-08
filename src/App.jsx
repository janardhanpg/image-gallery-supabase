import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

//https://rzfrryiwywvubqvkjgpw.supabase.co/storage/v1/object/public/Images/fd4d1c9e-e486-432f-8a67-f4d7839855a7/1d9e6b78-295c-4b79-88a9-3154a747cd97

const CDNURL =
  "https://rzfrryiwywvubqvkjgpw.supabase.co/storage/v1/object/public/Images/";

function App() {
  const [email, setEmail] = useState("");
  const user = useUser();
  const supabase = useSupabaseClient();
  const [images, setImages] = useState([]);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("Images")
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      }); // Cooper/
    // data: [ image1, image2, image3 ]
    // image1: { name: "subscribeToCooperCodes.png" }

    // to load image1: CDNURL.com/subscribeToCooperCodes.png -> hosted image

    if (data !== null) {
      setImages(data);
    } else {
      alert("Error loading images");
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
    });

    if (error) {
      alert(
        "Error communicating with supabase, make sure to use a real email address!"
      );
      console.log(error);
    } else {
      alert("Check your email for a Supabase Magic Link to log in!");
    }
  }
  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  const uploadImage = async (e) => {
    let file = e.target.files[0];

    // userid: Cooper
    // Cooper/
    // Cooper/myNameOfImage.png
    // Lindsay/myNameOfImage.png

    const { data, error } = await supabase.storage
      .from("Images")
      .upload(user.id + "/" + uuidv4(), file); // Cooper/ASDFASDFASDF uuid, taylorSwift.png -> taylorSwift.png

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  };
  async function deleteImage(imageName) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome to Image Gallery</h1>{" "}
          <Form>
            <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
              <Form.Label>
                Enter an email to sign in with a Supabase Magic Link
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={magicLinkLogin}>
              Get Magic Link
            </Button>
          </Form>
        </>
      ) : (
        <>
          <h1>Your Image Wall</h1>
          <Button onClick={signOut}>Sign Out</Button>
          <p>Current User: {user.email}</p>
          <p>
            Use the Choose File button below to upload an image to your gallery
          </p>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => uploadImage(e)}
            />
          </Form.Group>
          <hr />
          <h3>Your Images</h3>
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={CDNURL + user.id + "/" + image.name}
                    />
                    <Card.Body>
                      <Button
                        variant="danger"
                        onClick={() => deleteImage(image.name)}
                      >
                        Delete Image
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
