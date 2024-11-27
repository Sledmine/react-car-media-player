#!/usr/bin/env luajit

-- Fix os.execute to return true or false instead of 0 or 1
local luaOsExecute = os.execute
local function execute(cmd)
    local status = luaOsExecute(cmd)
    if status == 0 then
        return true
    else
        return false
    end
end

os.execute = execute

local function isPhoneConnected()
    return os.execute("adb devices -l | grep usb")
end

local function waitForDevice()
    if not isPhoneConnected() then
        print("Phone not connected! Waiting for device...")
        os.execute("adb wait-for-device")
    end

    os.execute("scrcpy --no-control --no-video --audio-buffer=80")
    print("Phone connected! Starting screen mirror...")
end

while true do
    waitForDevice()
end
