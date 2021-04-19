using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerSoundFX : MonoBehaviour
{
    public AudioSource playerSoundFX;
    public AudioClip PlayerShootSound;
    public AudioClip PlayerDeathSound;
    public AudioClip PlayerHopSound;
    public AudioClip PlayerOOFSound;
    public AudioClip PlayerOuchSound;

    // Start is called before the first frame update
    void Start()
    {
        this.playerSoundFX = GetComponent<AudioSource>();
        this.playerSoundFX.volume = 0.75f;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
    /* Setter method that sets the effectPlayer to assigned clip */
    public void setAudio(AudioClip clip)
    {
        this.playerSoundFX.clip = clip;
    }

    /* Explosion sound fx */
    public void playerExplosion()
    {
        Debug.Log("Player dead soundfx");
        this.playerSoundFX.PlayOneShot(PlayerDeathSound, 0.75f);
    }

    public void shootSoundFX()
    {
        //this.setAudio(this.PlayerShootSound);
        //this.playerSoundFX.Play();
        this.playerSoundFX.PlayOneShot(PlayerShootSound, 0.75f);

    }

    public void hopSoundFX()
    {
        this.playerSoundFX.PlayOneShot(PlayerHopSound, 1.5f);
    }

    public void oofSoundFX()
    {
        this.playerSoundFX.PlayOneShot(PlayerOOFSound, 1.5f);
        this.playerSoundFX.PlayOneShot(PlayerOuchSound, 0.7f);
    }
}
