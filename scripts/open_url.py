"""
open_url.py

Interactive: asks for a URL, then which TV to open it on, and launches
that TV's browser to the given address.

LG path reuses the exact manifest/launch call confirmed working
earlier this session (ssap://system.launcher/launch -> com.webos.app.browser).

Samsung path uses the standard Tizen technique: launching
org.tizen.browser via an 'ed.apps.launch' message (action_type
NATIVE_LAUNCH, URL as metaTag) sent over the same authenticated
remote-control WebSocket channel already used for send_key/pointer
control on that TV. NOTE: unlike the LG path, this exact call hasn't
been exercised against your Samsung TV in this project yet -- treat
the first run as a test, not a known-good path.

Requires: pip install websocket-client
"""

import base64
import json
import ssl
import uuid

import websocket

# --- LG ---
LG_HOST = "192.168.0.63"
LG_PORT = 3001
LG_CLIENT_KEY = "6d30c60f55c97b5b77b0ebc544aa671f"

LG_REGISTER_PAYLOAD = {
    "forcePairing": False,
    "pairingType": "PROMPT",
    "client-key": LG_CLIENT_KEY,
    "manifest": {
        "manifestVersion": 1,
        "appVersion": "1.1",
        "signed": {
            "created": "20140509",
            "appId": "com.lge.test",
            "vendorId": "com.lge",
            "localizedAppNames": {"": "LG Remote App"},
            "localizedVendorNames": {"": "LG Electronics"},
            "permissions": [
                "TEST_SECURE", "CONTROL_INPUT_TEXT", "CONTROL_MOUSE_AND_KEYBOARD",
                "READ_INSTALLED_APPS", "CONTROL_POWER", "READ_CURRENT_CHANNEL",
                "READ_RUNNING_APPS", "READ_UPDATE_INFO", "UPDATE_FROM_REMOTE_APP",
                "READ_LGE_SDX", "READ_NOTIFICATIONS", "SEARCH", "WRITE_SETTINGS",
                "READ_SETTINGS", "GET_CURRENT_CHANNEL", "APP_TO_APP", "CONTROL_AUDIO",
                "CONTROL_INPUT_MEDIA_RECORDING", "CONTROL_INPUT_MEDIA_PLAYBACK",
                "CONTROL_INPUT_TV", "CONTROL_INPUT_JOYSTICK", "CONTROL_DISPLAY",
                "CONTROL_TV_SCREEN", "CONTROL_TV_STANBY", "CONTROL_FAVORITE_GROUP",
                "CONTROL_USER_INFO", "CHECK_BLUETOOTH_DEVICE", "CONTROL_BLUETOOTH",
                "CONTROL_TIMER_INFO", "STB_INTERNAL_CONNECTION", "CONTROL_RECORDING",
                "READ_RECORDING_STATE", "WRITE_RECORDING_LIST", "READ_RECORDING_LIST",
                "READ_RECORDING_SCHEDULE", "WRITE_RECORDING_SCHEDULE",
                "READ_STORAGE_DEVICE_LIST", "READ_TV_CURRENT_TIME",
            ],
            "serial": "2f930e2d2cfe083771f68e4fe7bb07",
        },
        "permissions": [
            "LAUNCH", "LAUNCH_WEBAPP", "APP_TO_APP", "CLOSE", "TEST_OPEN",
            "TEST_PROTECTED", "CONTROL_AUDIO", "CONTROL_DISPLAY",
            "CONTROL_INPUT_JOYSTICK", "CONTROL_INPUT_MEDIA_RECORDING",
            "CONTROL_INPUT_MEDIA_PLAYBACK", "CONTROL_INPUT_TV", "CONTROL_POWER",
            "READ_APP_STATUS", "READ_CURRENT_CHANNEL", "READ_INPUT_DEVICE_LIST",
            "READ_NETWORK_STATE", "READ_RUNNING_APPS", "READ_TV_CHANNEL_LIST",
            "WRITE_NOTIFICATION_TOAST", "READ_POWER_STATE", "READ_COUNTRY_INFO",
            "READ_SETTINGS", "CONTROL_TV_SCREEN", "CONTROL_TV_STANBY",
            "CONTROL_FAVORITE_GROUP", "CONTROL_USER_INFO", "CHECK_BLUETOOTH_DEVICE",
            "CONTROL_BLUETOOTH", "CONTROL_TIMER_INFO", "STB_INTERNAL_CONNECTION",
            "CONTROL_RECORDING", "READ_RECORDING_STATE", "WRITE_RECORDING_LIST",
            "READ_RECORDING_LIST", "READ_RECORDING_SCHEDULE", "WRITE_RECORDING_SCHEDULE",
            "READ_STORAGE_DEVICE_LIST", "READ_UPDATE_INFO", "UPDATE_FROM_REMOTE_APP",
            "READ_LGE_SDX", "CONTROL_INPUT_TEXT", "CONTROL_MOUSE_AND_KEYBOARD",
            "READ_INSTALLED_APPS", "READ_LGE_TV_INPUT_EVENTS", "READ_TV_CURRENT_TIME",
        ],
    },
}

# --- Samsung ---
SAMSUNG_HOST = "192.168.0.94"
SAMSUNG_PORT = 8002
SAMSUNG_CLIENT_NAME = "SmartTV-Lab"
SAMSUNG_TOKEN = "58668928"


def open_on_lg(url):
    ws = websocket.create_connection(
        f"wss://{LG_HOST}:{LG_PORT}",
        sslopt={"cert_reqs": ssl.CERT_NONE},
        suppress_origin=True,
        timeout=10,
    )
    ws.send(json.dumps({"id": "register_0", "type": "register", "payload": LG_REGISTER_PAYLOAD}))
    reg = json.loads(ws.recv())
    if reg.get("type") != "registered":
        reg = json.loads(ws.recv())
    if reg.get("type") != "registered":
        ws.close()
        raise ConnectionError(f"LG registration failed: {reg}")

    msg_id = str(uuid.uuid4())
    ws.send(json.dumps({
        "id": msg_id, "type": "request",
        "uri": "ssap://system.launcher/launch",
        "payload": {"id": "com.webos.app.browser", "params": {"target": url}},
    }))
    resp = json.loads(ws.recv())
    ws.close()
    return resp


def open_on_samsung(url):
    name_b64 = base64.b64encode(SAMSUNG_CLIENT_NAME.encode()).decode()
    ws_url = (
        f"wss://{SAMSUNG_HOST}:{SAMSUNG_PORT}/api/v2/channels/samsung.remote.control"
        f"?name={name_b64}&token={SAMSUNG_TOKEN}"
    )
    ws = websocket.create_connection(ws_url, sslopt={"cert_reqs": ssl.CERT_NONE}, timeout=10)
    connect_resp = json.loads(ws.recv())  # ms.channel.connect / unauthorized

    payload = {
        "method": "ms.channel.emit",
        "params": {
            "event": "ed.apps.launch",
            "to": "host",
            "data": {
                "action_type": "NATIVE_LAUNCH",
                "appId": "org.tizen.browser",
                "metaTag": url,
            },
        },
    }
    ws.send(json.dumps(payload))
    ws.close()
    return connect_resp


def main():
    url = input("URL to open: ").strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    print("\nWhich TV?")
    print("  1) LG")
    print("  2) Samsung")
    print("  3) Both")
    choice = input("> ").strip()

    if choice == "1":
        print(f"Opening {url} on LG...")
        print("Result:", open_on_lg(url))
    elif choice == "2":
        print(f"Opening {url} on Samsung...")
        print("Result:", open_on_samsung(url))
    elif choice == "3":
        print(f"Opening {url} on LG...")
        try:
            print("LG result:", open_on_lg(url))
        except Exception as e:
            print("LG failed:", e)

        print(f"Opening {url} on Samsung...")
        try:
            print("Samsung result:", open_on_samsung(url))
        except Exception as e:
            print("Samsung failed:", e)
    else:
        print("Unrecognized choice, exiting.")
        return

    print("Check the TV screen(s).")


if __name__ == "__main__":
    main()