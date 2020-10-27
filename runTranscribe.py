import os
import torch
import zipfile
import torchaudio
from glob import glob
from omegaconf import OmegaConf
from utils import (init_jit_model_local, read_batch, prepare_model_input, split_into_batches)
import sys

device = torch.device('cpu')  # gpu also works, but our models are fast enough for CPU
models = OmegaConf.load('models.yml')

model, decoder = init_jit_model_local('es_v1_jit.model', device=device)
#model, decoder, utils = torch.hub.load(github='snakers4/silero-models', model='silero_stt', language='es', device=device)

# download a single file, any format compatible with TorchAudio (soundfile backend)
#torch.hub.download_url_to_file('https://silero-models.ams3.cdn.digitaloceanspaces.com/models/es_sample.wav', dst ='speech_orig.wav', progress=True)
os.system(f"""ffmpeg -i {sys.argv[1]} nm-{sys.argv[1][:-4]}.wav""")

test_files = glob(f"""nm-{sys.argv[1][:-4]}.wav""")
batches = split_into_batches(test_files, batch_size=10)
input = prepare_model_input(read_batch(batches[0]), device=device)

output = model(input)
for example in output:
    print(decoder(example.cpu()))
