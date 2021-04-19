using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundFX : MonoBehaviour
{
    
    //TODO: public AudioClip BossDeathSound;
    public AudioSource effectPlayer;
    
    // Start is called before the first frame update
    void Start()
    {
        effectPlayer = GetComponent<AudioSource>();
        this.effectPlayer.volume = 0.3f; /* Set volume when game starts */
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    /* Setter method that sets the effectPlayer to assigned clip */
    public void setAudio(AudioClip clip)
    {
        this.effectPlayer.clip = clip;
    }

}
