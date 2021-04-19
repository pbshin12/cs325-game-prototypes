using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public float timeBetweenSpawn = 4.0f; /* Spawning pipe obstacle */
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

    public GameObject pipePrefab;
    private int incrementCounter = 0;
    private float speed = -5f;

    public GameObject solidGround;
    public Transform solidGroundSpawn;

    

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
        
        if (GameManager.playerAlive && GameManager.bossAlive)
        {
            if (timer >= timeBetweenSpawn && phase >= 2)
            {
                spawnPipe();
                timer = 0;
            }
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

       if (bossHealth <= 1000)
        {
            Debug.Log("FINAL Phase intiated");
            this.timeBetweenSpawn = 1.5f;
            if (speed <= -7f)
            {
                speed -= 0.05f;
                PipeSpeed.pipeSpeed = new Vector2(speed, 0);
                incrementCounter++;
            }
            
            phase = 3;
            timeBetweenSpawn = 2.0f;
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
            Instantiate(solidGround, solidGroundSpawn.position, Quaternion.identity);
        }


    }

    /* Will either spawn pipes on top or at the bottom, randomly */
    void spawnPipe()
    {
        float randomVal = Random.Range(0f, 1f) * 100;
        Debug.Log("\tSPAWN PIPE HOIIIIIIIIIIIIIIIIII " + randomVal);
        /* Bottom pipe */
        if (randomVal <= 49f)
        {
            Instantiate(pipePrefab, new Vector3(10, Random.Range(-7f, -4.5f), 0), Quaternion.Euler(0, 0, 180));
        }
        else
        {
            Instantiate(pipePrefab, new Vector3(10, Random.Range(3.5f, 6.0f), 0), Quaternion.identity);
        }
        
    }
}
