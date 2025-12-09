from gpiozero import LED, Button
from signal import pause
from awsiot import mqtt5_client_builder, iotshadow
from awscrt import mqtt5, mqtt_request_response
import uuid
import logging
import json
import time
from config import IotConfig, BoardPins

logging.basicConfig(level=logging.INFO,format="%(asctime)s - [%(levelname)s]- %(message)s")
logger = logging.getLogger(__name__)

class AWSIoTClient:
    def __init__(self):
        self.mqtt5_client= None
        # shadow client
        self.shadow_client= None
        # token
        self.token = str(uuid.uuid4())

    def mqt_connect(self):
        try:
            self.mqtt5_client = mqtt5_client_builder.mtls_from_path(
                endpoint=IotConfig.ENDPOINT,
                cert_filepath=IotConfig.CERT_PATH,
                pri_key_filepath=IotConfig.KEY_PATH,
                ca_filepath=IotConfig.CA_PATH,
                client_id=IotConfig.CLIENT_ID,
                clean_session=False,
                keep_alive_secs=30
                )
            self.mqtt5_client.start()
            logger.info("connected to aws via mqtt")

            rr_options = mqtt_request_response.ClientOptions(
                max_request_response_subscriptions = 2,
                max_streaming_subscriptions = 2,
                operation_timeout_in_seconds = 30)
            # self.shadow_client = iotshadow.IotShadowClientV2(self.shadow_client)
            logger.info("connected to shadow client")
        except Exception as e:
            logger.error(f"Connection failed :{e}")
    def publish_state(self, payload):
        try:
            publish_packet = mqtt5.PublishPacket(topic=IotConfig.TOPIC,payload=json.dumps(payload),qos=mqtt5.QoS.AT_LEAST_ONCE)
            
            packet = self.mqtt5_client.publish(publish_packet)
            logger.info(f"State published: {payload}")
        except Exception as e:
            logger.error(f"Failed to publish state: {e}")




class WaterSystemReplicaHardware:
    def __init__(self,iot_client):
        self.led1=LED(BoardPins.LED1_PIN)
        self.led2=LED(BoardPins.LED2_PIN)
        self.button=Button(BoardPins.BUTTON_PIN)
        self.iot_client=iot_client
        self.button.when_pressed = self.on_button_press
        self.button.when_released = self.on_button_release
    def get_state(self,status):
        return { 
            "device":IotConfig.CLIENT_ID,
            "status":status,
            "led1": "on" if self.led1.is_lit else "off",
            "led2": "on" if self.led2.is_lit else "off",
            "timestamp": int(time.time())
        }
    def on_button_press(self):
        self.led1.on()
        self.led2.off()
        logger.info("button pressed")
        # generate state 
        self.iot_client.publish_state(self.get_state("pressed"))
    def on_button_release(self):
        self.led1.off()
        self.led2.on()
        logger.info("button released")
        self.iot_client.publish_state(self.get_state("released"))


if __name__ == "__main__":
    try:
        logger.info("running service")
        aws_client = AWSIoTClient()
        aws_client.mqt_connect()
        # aws_client.subscribe_to_shadows()
        # aws_client.request_current_state()
        system = WaterSystemReplicaHardware(aws_client)
        logger.info("ready, listening for button change")
        pause()

    except KeyboardInterrupt:
        logger.info("Stoping")
    except Exception as e:
        logger.error(f"Error: {e}")
