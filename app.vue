<script setup lang="ts">
import {
  MapboxFullscreenControl,
  MapboxGeogeometryCircle,
  MapboxGeogeometryFill,
  MapboxMap,
  MapboxMarker,
  MapboxNavigationControl,
} from 'vue-mapbox-ts'
import { useQuasar } from 'quasar'
import type { IPharmacy } from '~/utils/common'

useSeoMeta({ title: 'GeoPharm224', description: 'Application de Géolocalisation des Pharmacies de Conakry' })

const $q = useQuasar()
const { coords, error } = useGeolocation({ enableHighAccuracy: true, timeout: 15000 })

const tab = ref<'all' | 'near' | 'search' | 'fullscreen' | 'info'>('all')

const showMarkers = ref(false)

const places = ref<IPharmacy[]>([])
const center = ref([-13.6160, 9.6029])
const myPosition = ref<{ longitude: number; latitude: number } | null>(null)
const cadre = [[-13.961647, 9.343013], [-13.414760, 9.807780]]

onMounted(async () => {
  await all()

  setTimeout(() => { showMarkers.value = true }, 3000)
})

async function all() {
  center.value = [-13.6160, 9.6029]

  places.value = await $fetch<IPharmacy[]>('/api/pharmacy/all')
}

async function near() {
  center.value = [-13.6160, 9.6029]

  if (error.value) {
    $q.notify({
      type: 'negative',
      icon: 'warning',
      position: 'bottom',
      message: 'Autorisez votre geolocalisation !!!',
    })

    return
  }

  const data = await $fetch<IPharmacy[]>('/api/pharmacy/near', {
    params: { longitude: coords.value.longitude, latitude: coords.value.latitude },
  })

  if (data.length === 0) {
    myPosition.value = null

    $q.notify({
      type: 'info',
      icon: 'info',
      position: 'bottom',
      message: '🥶 Aucune pharmacie trouvé (dans un rayon de 5km) !!!',
    })

    return
  }

  center.value = [coords.value.longitude, coords.value.latitude]
  myPosition.value = { longitude: coords.value.longitude, latitude: coords.value.latitude }
  places.value = data
}

function search() {
  center.value = [-13.6160, 9.6029]

  $q.dialog({
    dark: true,
    title: 'Trouve ta pharmacie',
    message: 'Cherchez par commune/quartier/pharmacie directement:',
    prompt: { model: '', isValid: val => val.length > 1 },
    cancel: true,
  })
    .onOk(async (payload) => {
      const data = await $fetch<IPharmacy[]>('/api/pharmacy/search', { params: { query: payload } })

      places.value = data

      if (places.value.length === 0) {
        $q.notify({
          type: 'warning',
          icon: 'warning',
          position: 'bottom',
          message: `Aucune pharmacie correspondante !`,
        })
      }
    })
}

function info() {
  $q.dialog({
    dark: true,
    html: true,
    title: 'GeoPharm224',
    message: `
      <p>Impossible n'est pas, donc faisons.</p>
      <p>C'est avec cet état d'esprit que le projet GeoPharm224 a vu le jour, dans le but de faciliter l'accès aux services de santé, notamment les pharmacies, pour les Guinéens.</p>
      <br>
      <p class="text-italic">Copyright © 2023 GeoPharm224</p>
    `,
    ok: false,
  })
}

function popup(place: IPharmacy) {
  $q.dialog({
    dark: true,
    html: true,
    title: `<span class="text-secondary">${place.name}</span>`,
    message: `
      <div class="text-body1">
        <p>Téléphone : <span class="text-bold">${place.phoneNumber}</span></p>
        <p>Zone : <span class="text-bold">${place.area}</span></p>
      </div>
    `,
    ok: false,
  })
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn icon="fas fa-capsules" label="GeoPharm224" flat no-wrap @click="all" />

        <q-space />

        <q-tabs v-if="!$q.screen.xs" v-model="tab" shrink stretch>
          <q-tab name="all" icon="apps" @click="all" />
          <q-tab name="near" icon="near_me" @click="near" />
          <q-tab name="search" icon="search" @click="search" />
          <q-tab
            name="fullscreen"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
          />
          <q-tab name="info" icon="info" @click="info" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <MapboxMap
          id="box"
          :access-token="useRuntimeConfig().public.mapboxToken"
          :auto-resize="true"
          :center="center"
          :zoom="$q.screen.xs ? 11 : 12"
          :max-bounds="cadre"
          map-style="streets-v11"
        >
          <template v-if="showMarkers">
            <MapboxMarker
              v-for="place in places"
              :key="place.name"
              v-auto-animate
              :lng-lat="[place.location.coordinates[0], place.location.coordinates[1]]"
              @click="popup(place)"
            />
          </template>

          <MapboxGeogeometryCircle
            v-if="tab === 'near' && !!myPosition"
            :center="[myPosition.longitude ?? -13.6160, myPosition.latitude ?? 9.6029]"
            :radius="5"
            :edges="45"
          >
            <MapboxGeogeometryFill color="#26A69A" :opacity="0.2" />
          </MapboxGeogeometryCircle>

          <MapboxNavigationControl />
          <MapboxFullscreenControl />
        </MapboxMap>
      </q-page>
    </q-page-container>

    <q-footer v-if="$q.screen.xs" bordered>
      <q-tabs v-model="tab" narrow-indicator>
        <q-tab name="all" icon="apps" @click="all" />
        <q-tab name="near" icon="near_me" @click="near" />
        <q-tab name="search" icon="search" @click="search" />
        <q-tab
          name="fullscreen"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()"
        />
        <q-tab name="info" icon="info" @click="info" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  height: 100vh;
  width: 100vw;
}

#box {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
