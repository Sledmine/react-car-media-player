import { os, filesystem } from "@neutralinojs/lib"

// TODO Get the music files path from the device
const musicFilesPath = "/sdcard/Music"

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
    const isPlaying = lines.find((line) => line.includes("state=PlaybackState {state=3")) ? true : false
    const description = currentMedia.split("description=")[1]
    // Take all text up to the first comma as the title
    const title = description.split(",")[0].trim()
    // Take all text from right to the first comma as the album
    const album = description.split(",").slice(-1)[0].trim()
    // Take all text in the middle as the artist
    const artist = description.split(",").slice(1, -1).join(",").trim()

    // Create a hash to identify the song, keep alphanumeric characters only, keep utf-8 characters
    const hash = `${title}${artist.replace(",", "")}${album}`.toLowerCase().replace(/[^a-z0-9]/g, "")
    //console.log(`Hash: ${hash}`)

    // Get song cover from filesystem
    //const { stdOut: coverPath } = await os.execCommand(`adb shell content query --uri content://media/external/audio/media --projection album_art --where "title='${title}' AND artist='${artist}' AND album='${album}'"`)
    const coverPathFromDevice = `${musicFilesPath}/covers/${hash}.jpg`
    const coverPathInFileSystem = `/tmp/${hash}.jpg`
    const coverInStaticServer = `http://localhost:8080/${hash}.jpg`
    let cover
    try {
        // Album is "-" when a song did not have a proper cover downloaded in the device
        if (album !== "-") { 
            await filesystem.getStats(coverPathInFileSystem)
            cover = coverInStaticServer
        }
    } catch (error) {
        console.log(`Cover not found in filesystem, pulling from device`)
        const command = `adb pull ${coverPathFromDevice} ${coverPathInFileSystem}`
        const { exitCode } = await os.execCommand(command)
        //console.log(`Command: ${command}`)
        //console.log(`Exit code: ${exitCode}`)
        if (exitCode === 0) {
            console.log(`Cover saved to ${coverPathInFileSystem}`)
            cover = coverInStaticServer
        } else {
            console.log(`Error pulling cover from device`)
        }
    }

    if (title != "null") {
        return { title, artist, album, position: 0, cover, isPlaying }
    }
}

export const sendMediaCommand = async (command: string) => {
    const { exitCode } = await os.execCommand(`adb shell input keyevent ${command}`)
    return exitCode === 0
}
