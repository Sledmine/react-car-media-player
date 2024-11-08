import { os } from "@neutralinojs/lib"

export const getAndroidDevices = async () => {
  const { stdOut } = await os.execCommand("adb devices")
  return stdOut
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((line) => line.split("\t")[0])
}

export const getCurrentMediaSong = async () => {
    const { stdOut } = await os.execCommand("adb shell dumpsys media_session")
    const lines = stdOut.split("\n")
    const currentMedia = lines.find((line) => line.includes("description="))
    if (!currentMedia) {
        return null
    }
    const description = currentMedia.split("description=")[1]
    const data = description.split(", ")
    const title = data[0].trim();
    const artist = data[1].trim();
    const album = data[2].trim();
    return { title, artist, album, position: 0 }
}