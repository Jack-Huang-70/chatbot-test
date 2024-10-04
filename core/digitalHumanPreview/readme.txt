// These functions will check which video is ready to play, and play that video. At the same time, pause the
// playing video and clear the status of that video element. Two useEffect will check which videoElement could play
// the video.
// Handle new videoUrl Logic: If no video playing, set the new videoUrl to videoElement1 and play it.
// If videoElement1 is playing, set videoUrl to videoElement2 and play it, and set videoElement1 src to empty
// and opacity to 0
// If videoElement2 is playing, set videoUrl to videoElement1 and play it, and set videoElement2 src to empty
// and opacity to 0

// eg: a video(video1) play on 5s, duration is 15s.
// Another video(video2) play on 10s, duartion is 15s,
// One more video(video3) play on 20s, duration is 15s
// |----------|----------|----------|----------|----------|----------|----------|----------|
// 0          5          10         15         20         25         30         35
// Whole videoElement and video: VE=VideoElement
// |----------|----------|----------|----------|----------|----------|----------|----------|
//             video1----|
//                        video2---------------|
//                                              video3--------------------------|
//             VE1-------|VE2------------------|VE1-----------------------------|
//
//
// VideoElement1: (videoSrcRef)

//             ----------|                      --------------------------------| (Time of showing this videoElement)
//             ^                                ^
//             video1                           video3
// |----------|----------|----------|----------|----------|----------|----------|----------|
// 0          5          10         15         20         25         30         35
//            ^
//            Since no video playing on this time,
//            Set src to the video1
//             ----------|----------|----------|----------|----------|----------|----------|
//             ^
//             Video1 loading finish:
//             play it and set opacity to 1
//             Set VideoElement2 opacity to 0 and src to empty
//                        ----------|----------|----------|----------|----------|----------|
//                        ^
//                        Since VideoElement2 play now, the opacity and src of VideoElement1
//                        will be cleared here
//                                             |----------|----------|----------|----------|
//                                             ^
//                                             Since video3 coming but VideoElement2 is playing
//                                             Set src to the video 3
//                                              ----------|----------|----------|----------|
//                                              ^
//                                              Video3 Loading finish: play it and set opacity to 1
//                                              Set VideoElement2 opacity to 0 and src to empty
//                                                                              |----------|
//                                                                              ^
//                                                                              Video3 end, set src to empty
//                                                                              Set opacity to 0
//
// VideoElement2: (videoCutInRef)
//                        ---------------------|                                 (Time of showing this videoElement)
//                        ^
//                        video2
// |----------|----------|----------|----------|----------|----------|----------|----------|
// 0          5          10         15         20         25         30         35
//                       ^
//                       Since video2 coming but videoElement1 is Still playing,
//                       Set src to the video2
//                        ----------|----------|----------|----------|----------|----------|
//                        ^
//                        Video2 loading finish: play it and set opacity to 1
//                        Set VideoElement1 opacity to 0 and src to empty
//                                              ----------|----------|----------|----------|
//                                              ^
//                                              Since VideoElement1 play now, the opacity and
//                                              src of VideoElement2 will be cleared here
//
// Handle the Playback video, if got playback msg, set into the not playing one video to src,
// If no video playing, just set the first videoElement(videoSrcRef) to play the video