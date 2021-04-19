using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public float timeBetweenSpawn = 1.0f; /* Spawning pipe obstacle */
    private float timer = 0f;

    public static int phase = 1;
    public static int playerHealth = 3;
    public static int bossHealth = 2500;
    public static bool playerAlive = true;
    public static bool bossAlive = true;

    AudioSource audioSource;
    public AudioClip explosion;
    private bool explosionPlayed = false;

    public GameObject player;
    public Transform spawnPoint;

    // Start is called before the first frame update
    void Start()
    {
        audioSource = GetComponent<AudioSource>();
        Instantiate(player, spawnPoint.position, Quaternion.identity);
    }

    // Update is called once per frame
    void Update()
    {
        timer += Time.deltaTime;
        
        if (timer >= timeBetweenSpawn && phase == 2)
        {
            spawnPipe();
            timer = 0;
        }

        /* 
         * There will be 3 phases in the bossfight:
         * the base phase, the second phase, and the final phase
         */
        if (playerHealth <= 0)
        {
            Debug.Log("Player is dead, GAME OVER!");
            playerAlive = false;
        }

       if (bossHealth == 2000)
        {
            Debug.Log("Phase 2 initiated");
            phase = 2;
        }

       if (bossHealth == 1000)
        {
            Debug.Log("FINAL Phase intiated");
            phase = 3;
        }

       if (!playerAlive && !this.explosionPlayed)
        {
            Debug.Log("GAME OVER");
            audioSource.PlayOneShot(explosion, 0.8f);
            this.explosionPlayed = true;
        }

       if (!bossAlive && !this.explosionPlayed)
        {
            Debug.Log("BOSS DIED");
            audioSource.PlayOneShot(explosion, 0.8f);
            this.explosionPlayed = true;
        }


    }

    void spawnPipe()
    {
        
    }
}
