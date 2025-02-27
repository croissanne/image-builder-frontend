#!/bin/bash
set -euo pipefail

# As playwright isn't supported on fedora/el, install dependencies
# beforehand.
sudo dnf install -y \
     alsa-lib \
     libXrandr-devel \
     libXdamage-devel \
     libXcomposite-devel \
     at-spi2-atk-devel \
     cups \
     atk

sudo systemctl enable --now cockpit.socket

sudo useradd admin -p "$(openssl passwd foobar)"
sudo usermod -aG wheel admin
echo "admin ALL=(ALL:ALL) NOPASSWD: ALL" | sudo tee "/etc/sudoers.d/admin-nopasswd"

function upload_artifacts {
    mkdir -p /tmp/artifacts/extra-screenshots
    USER="$(whoami)"
    sudo chown -R "$USER:$USER" playwright-report
    mv playwright-report /tmp/artifacts/
    sudo chown -R "$USER:$USER" /home/admin/.cache/cockpit-image-builder
    cp -a /home/admin/.cache/cockpit-image-builder /tmp/artifacts/blueprints-cache
}
trap upload_artifacts EXIT

sudo systemctl enable --now osbuild-composer.socket osbuild-local-worker.socket
sudo systemctl start osbuild-worker@1

sudo podman run \
     -e "PLAYWRIGHT_HTML_OPEN=never" \
     -e "CI=true" \
     --net=host \
     -v "$PWD:/tests" \
     --privileged  \
     --rm \
     --init \
     mcr.microsoft.com/playwright:v1.50.1-noble \
     /bin/sh -c "cd tests && npx -y playwright@1.50.1 test"
