// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// function MapOffcanvas() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow} placement={'bottom'}>
//         點選 Offcanvas
//       </Button>

//       <Offcanvas show={show} onHide={handleClose}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>test</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <b>國立暨南國際大學：<br /></b>
//           以為位於山中，實際上在台地的一樣交通不便的「國際」學校。
//           <img src="https://www.finance.ncnu.edu.tw/wp-content/uploads/2022/08/723211082_50_1_50.jpg" class="img-fluid" alt="littleMap" />
//           <br /><br />
//           1
//           {/* <img src="./group6.jpg" class="img-fluid" alt="littleMapItem1" /> */}
//           <img src="https://media.vogue.com.tw/photos/5f48bd78bd90c33ed5934ae3/master/w_1600,c_limit/imagereader%20(2).jpg"
//             class="img-thumbnail" alt="littleMapItem2" />
//           2
//           {/* 3 */}
//           <img src="https://obs.line-scdn.net/0htLMxlkQjK2NwATzmE51UNEhXJxJDZzFqUjJgBlAEIVdcLWQ3SzR4AAdTJU9VOGw2UG9gUAIEclNVYzhiGQ/w1200"
//             class="img-thumbnail" alt="littleMapItem3" />
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }

// // function MapOffcanvas() {
// //   return (
// //     <>
// //       {['start', 'end', 'top', 'bottom'].map((placement, idx) => (
// //         <OffCanvasExample key={idx} placement={placement} name={placement} />
// //       ))}
// //     </>
// //   );
// // }

// export default MapOffcanvas;

// ---------------------------------------------------------可成功從右邊出現
// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// const options = [
//   {
//     name: 'Enable both scrolling & backdrop',
//     scroll: true,
//     backdrop: true,
//     placement: "end",
//   },
// ];

// function OffCanvasExample({ name, ...props }) {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   // const audio = new Audio("green-piano.mp3");
//   const audio = document.getElementById("audio-element");
//   function playAudio() {
//     // audio.src = "die-for-you.mp3";
//     audio.play();
//   }
//   function stopAudio() {
//     audio.pause();
//     // audio.currentTime = 0;
//   }
//   return (
//     <>
//       <Button variant="primary" onClick={handleShow} className="me-2">
//         點選 Offcanvas
//       </Button>
//       <Offcanvas show={show} onHide={handleClose} {...props}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Offcanvas</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Button onClick={playAudio}>&#9834;</Button>
//           <Button onClick={stopAudio} className="m-3"><img src='stopMusic.jpg' alt='stop' style={{width: 22}}></img></Button><br />
//           <audio id="audio-element" src="green-piano.mp3" controls="true" style={{width:300}}></audio>
//           {/* <b>國立暨南國際大學：<br /></b>
//           以為位於山中，實際上在台地的一樣交通不便的「國際」學校。 */}
//           <img src="https://www.finance.ncnu.edu.tw/wp-content/uploads/2022/08/723211082_50_1_50.jpg" class="img-fluid" alt="littleMap" style={{ width: 140, height: 100 }} />

//           {/* 1
//           <img src="https://media.vogue.com.tw/photos/5f48bd78bd90c33ed5934ae3/master/w_1600,c_limit/imagereader%20(2).jpg"
//             className="img-thumbnail" alt="littleMapItem2" />
//           2 */}
//           {/* 3 */}
//           {/* <img src="https://obs.line-scdn.net/0htLMxlkQjK2NwATzmE51UNEhXJxJDZzFqUjJgBlAEIVdcLWQ3SzR4AAdTJU9VOGw2UG9gUAIEclNVYzhiGQ/w1200"
//             className="img-thumbnail" alt="littleMapItem3" /> */}
//           <img src="https://images.hhh.com.tw/uploads/_hcolumn/point03_81_05.jpg"
//             className="img-thumbnail" alt="littleMapItem3" />
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }

// function MapOffcanvas({ show, handleShow }) {
//   return (
//     <>
//       {options.map((props, idx) => (
//         <OffCanvasExample key={idx} {...props} />
//       ))}
//     </>
//   );
// }

// export default MapOffcanvas;

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

// const options = [
//   {
//     name: 'Enable both scrolling & backdrop',
//     scroll: true,
//     backdrop: true,
//     placement: "end",
//   },
// ];

// function OffCanvasExample({ name, ...props }) {
//   return (
//     <>
//       {/* <Button variant="primary" onClick={handleShow} className="me-2">
//         點選 Offcanvas
//       </Button>
//       <Offcanvas show={show} onHide={handleClose} {...props}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Offcanvas</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           <Button onClick={playAudio}>&#9834;</Button>
//           <Button onClick={stopAudio} className="m-3"><img src='stopMusic.jpg' alt='stop' style={{ width: 22 }}></img></Button><br />
//           <audio id="audio-element" src="green-piano.mp3" controls="true" style={{ width: 300 }}></audio>
//           <img src="https://www.finance.ncnu.edu.tw/wp-content/uploads/2022/08/723211082_50_1_50.jpg"
//             class="img-fluid" alt="littleMap" style={{ width: 140, height: 100 }} />
//           <img src="https://images.hhh.com.tw/uploads/_hcolumn/point03_81_05.jpg"
//             className="img-thumbnail" alt="littleMapItem3" />
//         </Offcanvas.Body>
//       </Offcanvas> */}
//     </>
//   );
// }

function MapOffcanvas() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const audio = new Audio("green-piano.mp3");
  const audio = document.getElementById("audio-element");
  function playAudio() {
    audio.play();
  }
  function stopAudio() {
    audio.pause();
    // audio.currentTime = 0;
  }
  return (
    <>
      {/* {options.map((props, idx) => (
        <OffCanvasExample key={idx} {...props} />
      ))} */}
      <Button variant="primary" onClick={handleShow} className="me-2">
        點選 Offcanvas
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Button onClick={playAudio}>&#9834;</Button>
          <Button onClick={stopAudio} className="m-3"><img src='stopMusic.jpg' alt='stop' style={{ width: 22 }}></img></Button><br />
          <audio id="audio-element" src="green-piano.mp3" controls="true" style={{ width: 300 }}></audio>
          <img src="https://www.finance.ncnu.edu.tw/wp-content/uploads/2022/08/723211082_50_1_50.jpg"
            class="img-fluid" alt="littleMap" style={{ width: 140, height: 100 }} />
          <img src="https://images.hhh.com.tw/uploads/_hcolumn/point03_81_05.jpg"
            className="img-thumbnail" alt="littleMapItem3" />
        </Offcanvas.Body>
      </Offcanvas>
      {/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button>

      <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Offcanvas right</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          ...
        </div>
      </div> */}
    </>
  );
}

export default MapOffcanvas;